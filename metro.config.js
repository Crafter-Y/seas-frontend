const path = require("path");

const withStorybook = require("@storybook/react-native/metro/withStorybook");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withStorybook(getDefaultConfig(__dirname), {
  configPath: path.resolve(__dirname, "./.storybook"),
});

config.transformer.minifierConfig = {
  compress: {
    // The option below removes all console logs statements in production.
    drop_console: true,
  },
};

module.exports = withNativeWind(config, {
  input: "./nativewind.css",
});
