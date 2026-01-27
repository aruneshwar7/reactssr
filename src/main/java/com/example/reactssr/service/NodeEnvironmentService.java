package com.example.reactssr.service;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Engine;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.IOAccess;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

import static com.example.reactssr.service.JsRunnerService.getRoot;

@Service
public class NodeEnvironmentService {

    private final Engine engine;

    public NodeEnvironmentService() {
        this.engine = Engine.newBuilder("js").build();
    }

    public String testConsole() {
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
            Value renderFn =
                    context.getBindings("js").getMember("render");

            Map<String, Object> props = new HashMap<>();
            props.put("productName", "t shirt");
            props.put("message", "oversize t shirt for mens");
            ObjectMapper objectMapper = new ObjectMapper();
            String s = objectMapper.writeValueAsString(props);
            Value html = renderFn.execute(s);
            System.out.printf(html.asString());

            return html.asString();

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
        globalThis.process = { env: { NODE_ENV: "development" } };
        globalThis.global = globalThis;
    """);

        // Buffer
        context.eval("js", """
        const buffer = require("buffer");
        globalThis.Buffer = buffer.Buffer;
    """);

        // TextEncoder from util (NODE WAY)
        context.eval("js", """
        const util = require("util");
        globalThis.TextEncoder = util.TextEncoder;
        globalThis.TextDecoder = util.TextDecoder;
    """);

        // console
        context.eval("js", """
        globalThis.console = console;
    """);
    }

}
