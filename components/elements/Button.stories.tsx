import Button from "@/components/elements/Button";
import { Color } from "@/helpers/Constants";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  component: Button,
  title: "Elements/Button",
  argTypes: {
    onPress: { action: "pressed" },
    color: {
      options: [Color.BLUE, Color.GREEN, Color.RED, Color.YELLOW],
      control: { type: "radio" },
    },
  },
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {};
