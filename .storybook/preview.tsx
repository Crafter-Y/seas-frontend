import React from "react";
import { View } from "react-native";

import type { Preview } from "@storybook/react";

const preview: Preview = {
  decorators: [
    (Story) => (
      <View
        style={{
          height: "100%",
          padding: 16,
          backgroundColor: "white",
        }}
      >
        <Story />
      </View>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
};

export default preview;
