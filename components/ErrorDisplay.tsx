import { Text } from "react-native";
import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  hasError: boolean;
  error: string | undefined;
  style?: ClassInput;
};

const ErrorDisplay = ({ hasError, error, style }: Props) => {
  return (
    <Text
      style={tw.style(
        {
          hidden: !hasError,
        },
        "text-red-500 mb-2",
        style
      )}
    >
      {error}
    </Text>
  );
};

export default ErrorDisplay;
