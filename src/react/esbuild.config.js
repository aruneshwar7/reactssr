import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "es2020",
  outfile: "dist/ssr.cjs"
});
