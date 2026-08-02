module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "@babel/plugin-transform-export-namespace-from",
      [
        "module-resolver",
        {
          alias: {
            "@": "./",
          },
        },
      ],
      // Reanimated 4 moved the worklets transform into react-native-worklets.
      // MUST stay last in this list.
      "react-native-worklets/plugin",
    ],
  };
};
