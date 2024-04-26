import type { Preview } from "@storybook/react";
import React from "react";
import { View } from "react-native";
import tw from "@/tailwind";

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={tw`items-center justify-center h-full p-4 bg-white`}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
};

export default preview;
