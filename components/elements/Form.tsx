import { View } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children?: ReactNode;
  style?: ClassInput;
};

const Form = ({ children, style }: Props) => {
  return (
    <View style={tw.style("rounded-t-lg shadow-lg", style)}>{children}</View>
  );
};

export default Form;
