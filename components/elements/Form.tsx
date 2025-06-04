import React, { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { ClassInput } from "twrnc/dist/esm/types";

import tw from "@/tailwind";

type Props = {
  children?: ReactNode;
  style?: ClassInput;
} & ViewProps;

const Form = ({ children, style, ...viewProps }: Props) => {
  return (
    <View style={tw.style("rounded-t-lg shadow-lg", style)} {...viewProps}>
      {children}
    </View>
  );
};

export default Form;
