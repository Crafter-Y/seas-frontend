// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("json");
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (el) => el !== "json"
);

module.exports = config;
