import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "es2020",
  outfile: "dist/ssr.cjs"
});
esbuild.build({
  entryPoints: ["src/client.js"],
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "es2020",
  outfile: "dist/client.js",
  loader: {
    ".js": "jsx"
  }
});

