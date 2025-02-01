import React from "react";
import { View, ViewProps } from "react-native";

type DividerType = "HORIZONTAL" | "VERTICAL";

type Props = {
  type: DividerType;
} & ViewProps;

const variantStyles = {
  VERTICAL: "w-0.5",
  HORIZONTAL: "h-0.5",
};

const Divider = ({ className, ...props }: Props) => {
  return (
    <View
      className={`bg-seas-dark-gray ${variantStyles[props.type]} ${className}`}
      {...props}
    />
  );
};

export default Divider;
