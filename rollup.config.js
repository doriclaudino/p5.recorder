import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import banner from "rollup-plugin-banner";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/p5.recorder.js",
    output: {
      name: "p5.Recorder",
      file: pkg.module,
      format: "umd"
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module,
      banner(
        `<%= pkg.name %> \nv<%= pkg.version %>\nby <%= pkg.author %>\n<%= new Date().toLocaleDateString() %>`
      )
    ]
  }
];
