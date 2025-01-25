import React from "react";
import CustomText, { CustomTextProps } from "./CustomText";

const H1 = ({ className, ...props }: CustomTextProps) => {
  return (
    <CustomText
      className={`text-4xl font-bold opacity-85 underline mb-4 ${className}`}
      {...props}
    />
  );
};

export default H1;
