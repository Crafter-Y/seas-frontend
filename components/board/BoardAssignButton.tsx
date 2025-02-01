import { Pressable, PressableProps, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { Color } from "@/helpers/Constants";
import CustomText from "../elements/CustomText";

type Props = {
  color: keyof typeof Color;
  text?: string;
  actionType?: "PLUS" | "CROSS";
} & PressableProps;

const BoardAssignButton = ({
  color,
  text,
  className,
  actionType = "PLUS",
  ...props
}: Props) => {
  return (
    <Pressable
      className={`h-[32px] rounded-xl justify-center items-center flex-row disabled:opacity-45 active:opacity-65 ${text ? "pl-1" : "w-[32px]"} ${className}`}
      style={{
        backgroundColor: props.disabled ? Color.DARK_GRAY : Color[color],
      }}
      {...props}
    >
      {actionType === "PLUS" && (
        <View className="items-center justify-center">
          <Entypo name="plus" size={22} color="black" />
        </View>
      )}

      {actionType === "CROSS" && (
        <Entypo name="cross" size={22} color="black" />
      )}
      {text && <CustomText className="pr-2">{text}</CustomText>}
    </Pressable>
  );
};

export default BoardAssignButton;
