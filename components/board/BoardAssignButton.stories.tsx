import BoardAssignButton from "@/components/board/BoardAssignButton";
import { Color } from "@/helpers/Constants";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/BoardAssignButton",
  component: BoardAssignButton,
  argTypes: {
    color: {
      control: "select",
      options: Object.keys(Color),
    },
    actionType: {
      control: "radio",
      options: ["PLUS", "CROSS"],
    },
    onPress: { action: "pressed" },
    text: { control: "text" },
    disabled: { control: "boolean" },
  },
} as Meta<typeof BoardAssignButton>;

type Story = StoryObj<typeof BoardAssignButton>;

export const Default: Story = {
  args: {
    color: "BLUE",
    actionType: "PLUS",
  },
};

export const WithText: Story = {
  args: {
    color: "GREEN",
    actionType: "CROSS",
    text: "Assign",
  },
};

export const Disabled: Story = {
  args: {
    color: "YELLOW",
    actionType: "PLUS",
    disabled: true,
  },
};
