import React from "react";
import { View } from "react-native";

import Ratings, { Rating } from "@/components/elements/Ratings";

import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Elements/Ratings",
  component: Ratings,
  argTypes: {
    size: { control: "radio", options: ["large", "small"] },
    frozen: { control: "boolean" },
  },
} satisfies Meta<typeof Ratings>;

type Story = StoryObj<typeof Ratings>;

const RatingSet = (args: any) => (
  <View style={{ gap: 16 }}>
    {["1", "2", "3", "4", "5"].map((rating) => (
      <Ratings key={rating} {...args} initialValue={rating as Rating} />
    ))}
  </View>
);

export const Large: Story = {
  render: (args) => <RatingSet {...args} size="large" frozen={false} />,
};

export const Small: Story = {
  render: (args) => <RatingSet {...args} size="small" frozen={false} />,
};

export const LargeFrozen: Story = {
  render: (args) => <RatingSet {...args} size="large" frozen={true} />,
};

export const SmallFrozen: Story = {
  render: (args) => <RatingSet {...args} size="small" frozen={true} />,
};
