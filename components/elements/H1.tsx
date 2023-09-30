import { Text } from "react-native";
import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children?: React.ReactNode;
  style?: ClassInput;
};

const H1 = ({ children, style }: Props) => {
  return (
    <Text
      style={tw.style("text-4xl font-bold opacity-85 underline mb-4", style)}
    >
      {children}
    </Text>
  );
};

export default H1;
