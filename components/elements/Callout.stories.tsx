import Callout from "@/components/elements/Callout";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/Callout",
  component: Callout,
  argTypes: {
    visible: { control: "boolean" },
    message: { control: "text" },
  },
} satisfies Meta<typeof Callout>;

type Story = StoryObj<typeof Callout>;

export const Default: Story = {
  args: {
    visible: true,
    message: "This is a warning message!",
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
    message: "This message is hidden.",
  },
};
