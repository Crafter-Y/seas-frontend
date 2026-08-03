import { Image as RNImage, ImageProps } from "expo-image";
import React from "react";

type Props = {
  size?: number;
} & ImageProps;

const Image = ({ source, size = 4, style, contentFit, ...props }: Props) => {
  return (
    <RNImage
      source={source}
      contentFit={contentFit ?? "contain"}
      style={[
        {
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
