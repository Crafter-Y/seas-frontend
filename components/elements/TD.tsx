import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children?: ReactNode;
  style?: ClassInput;
  cols: number;
};

const TD = ({ children, style, cols }: Props) => {
  const { isSm } = useMediaQueries();

  return (
    <View
      style={tw.style(
        `py-4`,
        {
          "px-1": !isSm,
          "px-4": isSm,
          width: 100 / cols + "%",
        },
        style
      )}
    >
      {children}
    </View>
  );
};

export default TD;
