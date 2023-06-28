import { Text } from "react-native";
import React from "react";
import tw from "@/tailwind";

type Props = {
  hasError: Boolean;
  error: string | undefined;
};

const ErrorDisplay = ({ hasError, error }: Props) => {
  return (
    <Text
      style={tw.style(
        {
          hidden: !hasError,
        },
        "text-red-500 mb-2"
      )}
    >
      {error}
    </Text>
  );
};

export default ErrorDisplay;
