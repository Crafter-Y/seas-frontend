import React from "react";
import { View, ViewProps } from "react-native";

const Form = ({ className, ...viewProps }: ViewProps) => {
  return (
    <View className={`rounded-t-lg shadow-lg ${className}`} {...viewProps} />
  );
};

export default Form;
