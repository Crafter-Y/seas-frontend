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

const BoardHeaderRoundButton = ({
  imageSource,
  onPress,
  style,
  hidden = false,
}: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  if (!hidden)
    return (
      <TouchableOpacity
        style={tw.style(
          {
            backgroundColor: isHovered ? Color.LIGHT_GRAY : undefined,
          },
          "items-center justify-center h-10 w-10 rounded-full",
          style
        )}
        ref={ref}
        onPress={onPress}
      >
        <Image source={imageSource} size={16} />
      </TouchableOpacity>
    );
  return <></>;
};

export default BoardHeaderRoundButton;
