const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmpackPlugin = require("@wasm-tool/wasm-pack-plugin");

const path = require("path");

module.exports = {
  // webpack
  entry: "./src/bootstrap.ts",
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  mode: "development",
  plugins: [
    //new CopyWebpackPlugin({patterns: [{ from: "./src/index.html", to: "./dist" }],}),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

    new WasmpackPlugin({
      crateDirectory: path.resolve(__dirname, "./src/wasm"),
      args: "--log-level warn",
      //extraArgs: "--no-typescript",
      outDir: path.resolve(__dirname, "./src/wasm/pkg"),
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
  },

  module: {
    rules: [
      //ts
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: [/node_modules/],
      },
      //scss
      {
        test: /\.s[ac]ss$/i,
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
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  //wasm
  experiments: {
    //syncWebAssembly: true,
    asyncWebAssembly: true,
  },
};
