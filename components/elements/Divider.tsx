import { View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";
import { Color } from "@/helpers/Constants";

type DividerType = "HORIZONTAL" | "VERTICAL";

type Props = {
  style?: ClassInput;
  type: DividerType;
};

const Divider = ({ style, type }: Props) => {
  return (
    <View
      style={tw.style(
        `bg-[${Color.DARK_GRAY}]`,
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
