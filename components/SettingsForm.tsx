import { View, ViewProps } from "react-native";
import React from "react";

const SettingsForm = ({ className, ...props }: ViewProps) => {
  return (
    <View
      className={`px-6 sm:px-24 md:px-0 w-full md:w-96 gap-2 ${className}`}
      {...props}
    />
  );
};

export default SettingsForm;
