import React, { memo, useCallback, useRef } from "react";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";
import { ClassInput } from "twrnc/dist/esm/types";
import { Color } from "@/helpers/Constants";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ClassInput;
  hidden?: boolean;
};

type BtnProps = {
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ClassInput;
};

const ActualButton = ({ icon, onPress, style }: BtnProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const callback = useCallback(() => {
    setTimeout(() => {
      onPress?.();
    }, 5);
  }, [onPress]);

  return (
    <TouchableOpacity
      ref={ref}
      style={tw.style(
        {
          backgroundColor: isHovered ? Color.LIGHT_GRAY : undefined,
        },
        "items-center justify-center h-10 w-10 rounded-full",
        style
      )}
      onPress={callback}
    >
      {icon}
    </TouchableOpacity>
  );
};

const RoundIconButton = ({ icon, onPress, style, hidden = false }: Props) => {
  return hidden ? (
    <></>
  ) : (
    <ActualButton icon={icon} onPress={onPress} style={style} />
  );
};

export default memo(RoundIconButton);
