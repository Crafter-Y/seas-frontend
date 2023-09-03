import { View, Text, Pressable } from "react-native";
import React from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";

type Props = {
  pages: APIResponsePage[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const BoardPageSelector = ({ pages, currentPage, setCurrentPage }: Props) => {
  const { isSm } = useMediaQueries();

  return (
    <View
      style={tw.style(
        {
          "px-0": !isSm,
          "px-6": isSm,
          "mx-2": !isSm
        },
        `flex-row flex-wrap gap-2 mt-2`
      )}
    >
      {pages.map((page) =>
        page.id == currentPage ? (
          <Text
            key={page.id}
            style={tw`bg-green-600 rounded-xl text-lg px-2 text-white`}
          >
            {page.name}
          </Text>
        ) : (
          <Pressable
            key={page.id}
            onPress={() => setCurrentPage(page.id)}
          >
            <Text style={tw`border border-black rounded-xl text-lg px-2`}>
              {page.name}
            </Text>
          </Pressable>
        )
      )}
    </View>
  );
};

export default BoardPageSelector;
