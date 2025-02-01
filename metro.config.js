const path = require("path");

const withStorybook = require("@storybook/react-native/metro/withStorybook");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withStorybook(getDefaultConfig(__dirname), {
  // set to false to disable storybook specific settings
  // you can use a env variable to toggle this
  enabled: true,
  // path to your storybook config folder
  configPath: path.resolve(__dirname, "./.storybook"),
});

// this is probably obsolete, since assets/config.json was moved to public/config.json and therefore, no json module needs to be bundled
config.resolver.assetExts.push("json");
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (el) => el !== "json",
);

config.transformer.unstable_allowRequireContext = true;
config.resolver.sourceExts.push("mjs");

config.transformer.minifierConfig = {
  compress: {
    // The option below removes all console logs statements in production.
    drop_console: true,
  },
};

module.exports = withNativeWind(config, {
  input: "./nativewind.css",
});
