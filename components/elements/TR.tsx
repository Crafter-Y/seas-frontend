import React from "react";
import { View, ViewProps } from "react-native";

const TR = ({ className, ...props }: ViewProps) => {
  return (
    <View
      className={`flex-row w-full bg-white border-t border-gray-300 ${className}`}
      {...props}
    />
  );
};

export default TR;
