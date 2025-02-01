import { StorybookConfig } from "@storybook/react-native-web-vite";

const main: StorybookConfig = {
  stories: ["../components/**/*.stories.?(ts|tsx|js|jsx)"],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
  framework: "@storybook/react-native-web-vite",
};

export default main;
