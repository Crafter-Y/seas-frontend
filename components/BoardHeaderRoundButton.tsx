import React, { useRef } from "react";
import tw from "@/tailwind";
import { ImageSource } from "expo-image";
import { useHover } from "react-native-web-hooks";
import { ClassInput } from "twrnc/dist/esm/types";
import Image from "@/components/elements/Image";
import { Color } from "@/helpers/Constants";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  imageSource:
    | string
    | number
    | string[]
    | ImageSource
    | ImageSource[]
    | null
    | undefined;
  onPress: () => void;
  style?: ClassInput;
  hidden?: boolean;
};

type BtnProps = {
  imageSource:
    | string
    | number
    | string[]
    | ImageSource
    | ImageSource[]
    | null
    | undefined;
  onPress: () => void;
  style?: ClassInput;
};

const ActualButton = ({ imageSource, onPress, style }: BtnProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <TouchableOpacity
      ref={ref}
      style={tw.style(
        {
          backgroundColor: isHovered ? Color.LIGHT_GRAY : undefined,
        },
        "items-center justify-center h-10 w-10 rounded-full",
        style
      )}
      onPress={onPress}
    >
      <Image source={imageSource} size={16} />
    </TouchableOpacity>
  );
};

const BoardHeaderRoundButton = ({
  imageSource,
  onPress,
  style,
  hidden = false,
}: Props) => {
  return hidden ? (
    <></>
  ) : (
    <ActualButton imageSource={imageSource} onPress={onPress} style={style} />
  );
};

export default BoardHeaderRoundButton;
