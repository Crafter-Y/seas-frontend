import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";

type Props = {
  children?: ReactNode;
};

const Form = ({ children }: Props) => {
  return <View style={tw`rounded-t-lg shadow-lg`}>{children}</View>;
};

export default Form;
