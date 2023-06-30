import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children?: ReactNode;
  style?: ClassInput;
};

const TD = ({ children, style }: Props) => {
  const { isSm } = useMediaQueries();

  return (
    <View
      style={tw.style(
        `flex-grow flex-shrink basis-full py-4`,
        {
          "px-1": !isSm,
          "px-4": isSm,
        },
        style
      )}
    >
      {children}
    </View>
  );
};

export default TD;
