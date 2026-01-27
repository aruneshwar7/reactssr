package com.example.reactssr.service;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Engine;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.IOAccess;
import org.springframework.core.NativeDetector;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class JsRunnerService {

    private static final ConcurrentMap<String, File> fileCache = new ConcurrentHashMap<>();

    public String render() throws Exception {

        String js = Files.readString(Path.of("/Users/arun-16756/Downloads/reactssr/src/react/dist/ssr.cjs"));
        Engine engine =  Engine.newBuilder("js").build();


        String polyfillPath;
        try (Context context = Context.newBuilder("js")
                // set the engine to a context to ensure optimized code is cached
                .engine(engine)
                .allowIO(IOAccess.ALL)
                .allowExperimentalOptions(true)
                .option("js.esm-eval-returns-exports", "true")
                .option("js.commonjs-require", "true")
                .option("js.commonjs-require-cwd", getRoot("polyfill").getAbsolutePath())
                .option("js.commonjs-core-modules-replacements",
                        "stream:stream-browserify,util:fastestsmallesttextencoderdecoder,buffer:buffer")
                .build();
        ) {

            // Polyfills

            Source globalSource = Source.create("js", """

				globalThis.process = {
					env: {
						NODE_ENV: 'production'
					}
				};
				globalThis.document = {};
				global = globalThis;
				""");
            context.eval(globalSource);

            context.eval(Source.newBuilder("js", js, "ssr.js").build());

            return context.eval("js", "render()").asString();
        } catch (Exception e)
        {
            e.printStackTrace();
            return "error";
        }
    }
    public String runJs() {
        try (Context context = Context.newBuilder("js")
                .allowAllAccess(true)
                .build()) {

            String jsCode = """
                function render() {
                    return "<h1>Hello from JS 👋</h1>";
                }
                render();
            """;

            Value result = context.eval("js", jsCode);
            return result.asString();
        }
    }
    static File getRoot(String root) {
        return fileCache.computeIfAbsent(root, key -> {
            try {
                if (NativeDetector.inNativeImage()) {
                    // in native image
                    return copyResources(root).toFile();
                }
                ClassPathResource resource = new ClassPathResource(root);
                if (resource.getURL().toString().startsWith("jar:")) {
                    // in jar file
                    return new FileSystemResource("./target/classes/" + root).getFile();
                }
                else {
                    return resource.getFile();
                }
            }
            catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        });
    }
    private static Path copyResources(String root) {
        try {
            Path baseDir = Files.createTempDirectory("copied-");
            baseDir.toFile().deleteOnExit();
            ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            for (Resource resource : resolver.getResources("classpath:/%s/**".formatted(root))) {
                String path = resource.getURI().toString().replace("resource:", "");
                Path destination = Paths.get(baseDir.toFile().getAbsolutePath(), path);
                Path parentDir = destination.getParent();
                if (parentDir != null) {
                    if (!Files.exists(parentDir)) {
                        Files.createDirectories(parentDir);
                    }
                }
                if (resource.isReadable()) {
                    try (InputStream input = resource.getInputStream();
                         OutputStream output = Files.newOutputStream(destination)) {
                        StreamUtils.copy(input, output);
                    }
                }
                else {
                    Files.createDirectories(destination);
                }
            }
            return Paths.get(baseDir.toFile().getAbsolutePath(), root);
        }
        catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }


}
