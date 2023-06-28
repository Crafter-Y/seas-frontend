import { Platform, View } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";
import { Picker as RNPicker } from "@react-native-picker/picker";

type Props = {
  selectedValue: string;
  onValueChange: (item: string) => void;
  children: ReactNode[];
};

const Picker = ({ selectedValue, onValueChange, children }: Props) => {
  return (
    <View style={tw.style("border border-black border-opacity-20 rounded-xl")}>
      <RNPicker
        style={tw.style(
          {
            "py-2": Platform.OS == "ios",
            "py-1": Platform.OS != "ios",
            fontSize: 18,
            border: "none",
          },

          `rounded-xl px-2 bg-transparent`
        )}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {children}
      </RNPicker>
    </View>
  );
};

export default Picker;
