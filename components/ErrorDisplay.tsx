import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";
import CustomText from "./elements/CustomText";

type Props = {
  hasError: boolean;
  error: string | undefined;
  style?: ClassInput;
};

const ErrorDisplay = ({ hasError, error, style }: Props) => {
  return (
    <CustomText
      style={tw.style(
        {
          hidden: !hasError,
        },
        "text-red-500 mb-2",
        style
      )}
    >
      {typeof error == "string" ? error : JSON.stringify(error)}
    </CustomText>
  );
};

export default ErrorDisplay;
