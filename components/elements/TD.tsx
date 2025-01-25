import { View, ViewProps } from "react-native";
import React from "react";

type Props = {
  cols: number;
} & ViewProps;

const TD = ({ cols, className, ...props }: Props) => {
  return (
    <View
      className={`py-4 px-1 sm:px-4 ${className}`}
      style={{ width: `${Math.ceil(100 / cols)}%` }}
      {...props}
    />
  );
};

export default TD;
