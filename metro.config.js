const { getDefaultConfig } = require("expo/metro-config");
const { generate } = require("@storybook/react-native/scripts/generate");
const path = require("path");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// this is probably obsolete, since assets/config.json was moved to public/config.json and therefore, no json module needs to be bundled
config.resolver.assetExts.push("json");
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (el) => el !== "json"
);

generate({
  configPath: path.resolve(__dirname, "./.storybook"),
});

config.transformer.unstable_allowRequireContext = true;
config.resolver.sourceExts.push("mjs");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(
    context,
    moduleName,
    platform
  );

  if (
    process.env.STORYBOOK_ENABLED !== "true" &&
    defaultResolveResult?.filePath?.includes?.(".storybook/")
  ) {
    return {
      type: "empty",
    };
  }

  return defaultResolveResult;
};

config.transformer.minifierConfig = {
  compress: {
    // The option below removes all console logs statements in production.
    drop_console: true,
  },
};

module.exports = withNativeWind(config, {
  input: "./nativewind.css",
});
