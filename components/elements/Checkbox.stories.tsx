import MyCheckbox from "@/components/elements/Checkbox";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: MyCheckbox,
  title: "Elements/Checkbox",
  argTypes: {
    onChange: { action: "changed" },
    disabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    label: "Basic checkbox with label",
  },
} satisfies Meta<typeof MyCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const DefaultChecked: Story = {
  args: {
    defaultValue: true,
  },
};
