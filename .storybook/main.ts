import type { StorybookConfig as ReactNativeConfig } from "@storybook/react-native";
import type { StorybookConfig as WebConfig } from "@storybook/react-native-web-vite";

const main: WebConfig & Pick<ReactNativeConfig, "deviceAddons"> = {
  stories: ["../components/**/*.stories.?(ts|tsx|js|jsx)"],
  deviceAddons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
  framework: "@storybook/react-native-web-vite",
};

export default main;
