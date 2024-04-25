import type { Meta, StoryObj } from "@storybook/react";
import MyButton from "./Button";
import { Color } from "@/helpers/Constants";

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
