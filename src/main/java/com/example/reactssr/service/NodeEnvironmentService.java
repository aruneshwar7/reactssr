package com.example.reactssr.service;

import com.example.reactssr.data.Dummydata;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Engine;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.IOAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import static com.example.reactssr.service.JsRunnerService.getRoot;

@Service
public class NodeEnvironmentService {
    private final Engine engine;

    @Autowired
    Dummydata dummydata;

    public NodeEnvironmentService() {
        this.engine = Engine.newBuilder("js").build();
    }

    public String testConsole(String route) {
        try (Context context = createContext()) {

            injectNodeGlobals(context);

            context.eval("js", """
                console.log("✅ Hello from GraalVM JS");
                console.log("Buffer exists:", typeof Buffer);
                console.log("process.env.NODE_ENV =", process.env.NODE_ENV);
            """);
            context.eval("js", """
                                              function render() {
                                                return "<h1>Hello SSR</h1>";
                                              }
                                            """);

            Value result = context.eval("js", "render()");
            System.out.println(result.asString());
            String js = Files.readString(Path.of("/Users/arun-16756/Downloads/reactssr/src/react/dist/ssr.cjs"));
            context.eval(Source.newBuilder("js", js, "ssr.js").build());
            Value renderFn = context.getBindings("js").getMember("render");

            Value renderedHtml = renderFn.execute(route);

            Path templatePath = Paths.get("src/main/resources/META-INF/resources/index.html");
            String template = Files.readString(templatePath);

            String fullHtml = template.replace("<!--app-html-->", renderedHtml.asString());
            fullHtml = fullHtml.replace("<!--app-init-data-->", " <script id=\"__INIT_DATA__\"  type=\"application/json\">"+ route + "</script>");

            return fullHtml;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Context createContext() {
        return Context.newBuilder("js")
                .engine(engine)
                .allowIO(IOAccess.ALL)
                .allowExperimentalOptions(true)
                .option("js.commonjs-require", "true")
                .option(
                        "js.commonjs-require-cwd",
                        getRoot("polyfill").getAbsolutePath()
                )
                .option("js.commonjs-core-modules-replacements",
                        "stream:stream-browserify,util:fastestsmallesttextencoderdecoder,buffer:buffer/")
                .build();
    }

    private void injectNodeGlobals(Context context) {

        // process
        context.eval("js", """
            globalThis.Buffer = require('buffer').Buffer;
            globalThis.URL = require('whatwg-url-without-unicode').URL;
            globalThis.process = {
                env: {
                    NODE_ENV: 'production'
                }
            };
            globalThis.document = {};
            global = globalThis;
    """);
    }

}
