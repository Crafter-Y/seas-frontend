module.exports = {
  expo: {
    name: "SEAS - Kirchengemeinden",
    slug: "csa-frontend",
    scheme: "seas-kirchengemeinde",
    version: "1.0.12",
    orientation: "default",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "de.craftery.seasfrontend",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./public/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "de.craftery.seasfrontend",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      output: "static",
    },
    extra: {
      eas: {
        projectId: "04b64ca7-4272-45dc-98cb-14e129c5ac01",
      },
      supportsRTL: true,
      storybookEnabled: process.env.STORYBOOK_ENABLED,
      productionApi: "https://api.seas-kirchengemeinde.de",
    },
    owner: "crafter_y",
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "expo-calendar",
        {
          calendarPermission:
            "Die App benötigt hierfür Zugriff auf den Kalender",
        },
      ],
      [
        "expo-font",
        {
          fonts: ["./assets/fonts/Roboto.ttf"],
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          image: "./assets/splash.png",
          imageWidth: 1061,
        },
      ],
    ],
  },
};
