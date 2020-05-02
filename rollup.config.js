import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";
import license from "rollup-plugin-license";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

let dev = {
  input: "src/p5.recorder.js",
  output: [
    {
      name: "p5.Recorder",
      file: pkg.module + ".js",
      format: "umd",
      sourcemap: true,
      plugins: [],
    },
    {
      name: "p5.Recorder",
      file: pkg.module + ".min.js",
      format: "umd",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    license({
      banner:
        "Copyright <%= pkg.name %> \nv<%= pkg.version %>\nby <%= pkg.author %>\n<%= new Date().toLocaleDateString() %>",
    }),
    babel({
      exclude: "node_modules/**",
    }),
    resolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module,  
    cleanup(),
  ],
};

export default [dev];
