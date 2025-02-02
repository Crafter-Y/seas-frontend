import BoardMenuButton from "@/components/board/BoardMenuButton";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/BoardMenuButton",
  component: BoardMenuButton,
  argTypes: {
    icon: { control: "text" },
    text: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof BoardMenuButton>;

type Story = StoryObj<typeof BoardMenuButton>;

export const Default: Story = {
  args: {
    icon: require("@/assets/img/settings.svg"),
    text: "Menu Item",
  },
};
