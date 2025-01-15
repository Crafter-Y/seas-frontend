import { View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import CustomText from "./CustomText";

type Props = {
  titles: string[];
};

const TH = ({ titles }: Props) => {
  const { isMd, isSm } = useMediaQueries();

  return (
    <View style={tw`flex-row w-full bg-[#f0f1f2] rounded-t-lg`}>
      {titles.map((title) => (
        <View
          style={tw.style({
            width: 100 / titles.length + "%",
          })}
          key={title}
        >
          <CustomText
            style={tw.style("font-semibold uppercase py-4", {
              "text-lg": isMd,
              "px-1": !isSm,
              "px-4": isSm,
            })}
          >
            {title}
          </CustomText>
        </View>
      ))}
    </View>
  );
};

export default TH;
