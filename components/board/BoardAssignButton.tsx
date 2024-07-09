import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import tw from "@/tailwind";
import { Entypo } from "@expo/vector-icons";
import { Color } from "@/helpers/Constants";
import { ClassInput } from "twrnc/dist/esm/types";

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
            },
            "h-8 rounded-xl justify-center items-center flex-row px-2",
            style
          )}
        >
          {actionType == "PLUS" && (
            <Text style={tw`font-bold text-lg`} selectable={false}>
              +
            </Text>
          )}

          {actionType == "CROSS" && (
            <Entypo name="cross" size={18} color="black" />
          )}
          <Text>{text}</Text>
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

export default BoardAssignButton;
