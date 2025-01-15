import { TextProps } from "react-native";
import React from "react";
import tw from "@/tailwind";
import CustomText from "./CustomText";

const H1 = (props: TextProps & { t?: string }) => {
  return (
    <CustomText
      {...props}
      style={[
        tw.style("text-4xl font-bold opacity-85 underline mb-4"),
        props.style,
      ]}
    />
  );
};

export default H1;
