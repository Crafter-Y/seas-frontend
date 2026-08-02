import React from "react";
import { DimensionValue, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import useMediaQueries from "@/hooks/useMediaQueries";

type Props = {
  titles: string[];
};

const TH = ({ titles }: Props) => {
  const { isMd, isSm } = useMediaQueries();

  return (
    <View className="flex-row w-full bg-[#f0f1f2] rounded-t-lg">
      {titles.map((title) => (
        <View
          style={{ width: `${100 / titles.length}%` as DimensionValue }}
          key={title}
        >
          <CustomText
            className={`font-semibold uppercase py-4 ${isMd ? "text-lg" : ""} ${
              isSm ? "px-4" : "px-1"
            }`}
          >
            {title}
          </CustomText>
        </View>
      ))}
    </View>
  );
};

export default TH;
