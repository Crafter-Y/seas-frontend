import React from "react";

import CustomText, { CustomTextProps } from "@/components/elements/CustomText";

type Props = {
  hasError: boolean;
  error: string | undefined;
} & CustomTextProps;

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
