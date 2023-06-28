import { View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";

type Props = {
  children?: React.ReactNode;
};

const SettingsForm = ({ children }: Props) => {
  const { isMd, isSm } = useMediaQueries();

  return (
    <View
      style={tw.style(
        {
          "w-full": !isMd,
          "w-72": isMd,
          "px-6": !isSm && !isMd,
          "px-24": isSm && !isMd,
          "px-0": isMd,
        },
        "gap-2"
      )}
    >
      {children}
    </View>
  );
};

export default SettingsForm;
