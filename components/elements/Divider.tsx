import { View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";

type DividerType = "HORIZONTAL" | "VERTICAL";

type Props = {
  style?: ClassInput;
  type: DividerType;
};

const Divider = ({ style, type }: Props) => {
  return (
    <View
      style={tw.style(
        "bg-[#e0e2e5]",
        {
          "w-0.5": type == "VERTICAL",
          "h-0.5": type == "HORIZONTAL",
        },
        style
      )}
    ></View>
  );
};

export default Divider;
