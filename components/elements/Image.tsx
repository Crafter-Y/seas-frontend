import { Image as RNImage, ImageProps } from "expo-image";
import React from "react";

type Props = {
  size?: number;
} & ImageProps;

const Image = ({ source, size = 4, style, ...props }: Props) => {
  return (
    <RNImage
      source={source}
      style={[
        {
          resizeMode: "contain",
          height: size,
          width: size,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default Image;
