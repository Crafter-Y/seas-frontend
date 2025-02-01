import { Image as RNImage, ImageSource } from "expo-image";
import React from "react";
import { ClassInput } from "twrnc/dist/esm/types";

import tw from "@/tailwind";

type Props = {
  source:
    | string
    | number
    | string[]
    | ImageSource
    | ImageSource[]
    | null
    | undefined;
  size?: number;
  style?: ClassInput;
};

const Image = ({ source, size = 4, style }: Props) => {
  return (
    <RNImage
      source={source}
      style={tw.style(
        {
          resizeMode: "contain",
          height: size,
          width: size,
        },
        style,
      )}
    />
  );
};

export default Image;
