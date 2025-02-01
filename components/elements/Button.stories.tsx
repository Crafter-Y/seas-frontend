import MyButton from "@/components/elements/Button";
import { Color } from "@/helpers/Constants";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: MyButton,
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
} satisfies Meta<typeof MyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
