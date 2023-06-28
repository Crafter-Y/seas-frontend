import { Text } from "react-native";
import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children?: React.ReactNode;
  style?: ClassInput;
};

const H2 = ({ children, style }: Props) => {
  return (
    <Text style={tw.style(`text-3xl font-semibold opacity-85 mb-3`, style)}>
      {children}
    </Text>
  );
};

export default H2;
