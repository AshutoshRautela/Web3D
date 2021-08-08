const path = require("path");

const ROOT = path.resolve(__dirname, "src");
const DESTINATION = path.resolve(__dirname, "dist");

module.exports = {
  context: ROOT,

  entry: {
    main: "./sandbox.tsx",
  },

  output: {
    filename: "[name].bundle.js",
    path: DESTINATION,
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".glsl"],
    modules: [ROOT, "node_modules"],
  },

  module: {
    rules: [
      /****************
       * LOADERS
       *****************/
      {
        test: /\.(ts|tsx)$/,
        exclude: [/node_modules/],
        use: "ts-loader",
      },
      {
        test: /\.glsl/,
        exclude: [/node_modules/],
        use: "webpack-glsl-loader",
      },
      {
        test: /\.s[ac]ss/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },

  devtool: "cheap-module-source-map",
};
