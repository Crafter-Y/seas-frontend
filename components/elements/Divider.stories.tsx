import { Text, View } from "react-native";

import Divider from "@/components/elements/Divider";

import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

export default {
  title: "Elements/Divider",
  component: Divider,
  argTypes: {
    type: {
      control: "radio",
      options: ["VERTICAL", "HORIZONTAL"],
    },
  },
} satisfies Meta<typeof Divider>;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    type: "HORIZONTAL",
  },
  decorators: [
    (Story) => (
      <View className="gap-2">
        <Text>Above</Text>
        <Story />
        <Text>Below</Text>
      </View>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    type: "VERTICAL",
  },
  decorators: [
    (Story) => (
      <View className="flex-row h-20 gap-2">
        <Text>Left</Text>
        <Story />
        <Text>Right</Text>
      </View>
    ),
  ],
};
