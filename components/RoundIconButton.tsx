import React from "react";
import { Pressable, PressableProps } from "react-native";

type Props = {
  icon: React.ReactNode;
  hidden?: boolean;
} & PressableProps;

const ActualButton = ({ icon, className, ...props }: Props) => {
  return (
    <Pressable
      className={`items-center justify-center h-10 w-10 rounded-full hover:bg-seas-light-gray ${className}`}
      {...props}
    >
      {icon}
    </Pressable>
  );
};

const RoundIconButton = ({ hidden = false, ...props }: Props) => {
  return hidden ? <></> : <ActualButton {...props} />;
};

export default RoundIconButton;
