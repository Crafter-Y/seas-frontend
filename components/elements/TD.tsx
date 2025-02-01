import React from "react";
import { View, ViewProps } from "react-native";

type Props = {
  cols: number;
} & ViewProps;

const widthStyles = [
  "w-full", // 1 row
  "w-1/2",
  "w-1/3",
  "w-1/4",
  "w-1/5", // 5 rows
  "w-1/6",
  "w-[14%]",
  "w-[12%]",
  "w-[11%]",
  "w-[10%]", // 10 rows - anything beyond that can be unhandled right now.
];

const TD = ({ cols, className, ...props }: Props) => {
  return (
    <View
      className={`py-4 px-1 sm:px-4 ${className} ${widthStyles[cols - 1]}`}
      // style={{ width: `${Math.ceil(100 / cols)}%` }}
      {...props}
    />
  );
};

export default TD;
