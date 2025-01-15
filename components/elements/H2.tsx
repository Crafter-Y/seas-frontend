import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";
import CustomText from "./CustomText";

type Props = {
  children?: React.ReactNode;
  style?: ClassInput;
};

const H2 = ({ children, style }: Props) => {
  return (
    <CustomText
      style={tw.style("text-3xl font-semibold opacity-85 mb-3", style)}
    >
      {children}
    </CustomText>
  );
};

export default H2;
