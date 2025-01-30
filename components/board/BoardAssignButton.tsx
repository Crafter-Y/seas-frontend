import { Pressable, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import tw from "@/tailwind";
import { Entypo } from "@expo/vector-icons";
import { Color } from "@/helpers/Constants";
import { ClassInput } from "twrnc/dist/esm/types";
import CustomText from "../elements/CustomText";

type Props = {
  onPress: () => void;
  color: "GREEN" | "RED" | "YELLOW" | "BLUE";
  text?: string;
  actionType?: "PLUS" | "CROSS";
  style?: ClassInput;
};

const BoardAssignButton = ({
  onPress,
  color = "GREEN",
  text,
  actionType = "PLUS",
  style,
}: Props) => {
  const ref = useRef(null);

  const [badgeColor, setBadgeColor] = useState("#16a34a");

  useEffect(() => {
    switch (color) {
      case "GREEN":
        setBadgeColor(Color.GREEN);
        break;
      case "RED":
        setBadgeColor(Color.RED);
        break;
      case "YELLOW":
        setBadgeColor(Color.YELLOW);
        break;
      case "BLUE":
        setBadgeColor(Color.BLUE);
        break;
    }
  }, [color]);

  return (
    <View style={tw`flex-row`}>
      <Pressable ref={ref}>
        <TouchableOpacity
          onPress={onPress}
          style={tw.style(
            {
              backgroundColor: badgeColor,
              "w-8": !text,
              "gap-1": !!text,
              cursor: "pointer",
              "pl-1": !!text,
            },
            "h-8 rounded-xl justify-center items-center flex-row",
            style,
          )}
        >
          {actionType === "PLUS" && (
            <View style={tw`items-center justify-center`}>
              <Entypo name="plus" size={22} color="black" />
            </View>
          )}

          {actionType === "CROSS" && (
            <Entypo name="cross" size={22} color="black" />
          )}
          {text && <CustomText style={tw`px-2`}>{text}</CustomText>}
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

export default BoardAssignButton;
