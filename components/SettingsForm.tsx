import { View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children?: React.ReactNode;
  style?: ClassInput;
};

const SettingsForm = ({ children, style }: Props) => {
  const { isMd, isSm } = useMediaQueries();

  return (
    <View
      style={tw.style(
        {
          "w-full": !isMd,
          "w-92": isMd,
          "px-6": !isSm && !isMd,
          "px-24": isSm && !isMd,
          "px-0": isMd,
        },
        "gap-2",
        style
      )}
    >
      {children}
    </View>
  );
};

export default SettingsForm;
