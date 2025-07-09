import React from "react";

import CustomText, { CustomTextProps } from "@/components/elements/CustomText";

type Props = {
  hasError: boolean;
  error: string | undefined;
} & CustomTextProps;

// TODO: refactor this to determine if there is an error based on the error prop = null
// just have error: string | null and delete hasError prop
const ErrorDisplay = ({ hasError, error, className, ...props }: Props) => {
  return (
    <CustomText
      className={`text-red-500 mb-2 ${hasError ? "" : "hidden"} ${className}`}
      {...props}
    >
      {typeof error === "string" ? error : JSON.stringify(error)}
    </CustomText>
  );
};

export default ErrorDisplay;
