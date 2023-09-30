import { View, Text, Pressable } from "react-native";
import React from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { Store } from "@/helpers/store";
import useAllPages from "@/hooks/api/useAllPages";

const BoardPageSelector = () => {
  const { isSm } = useMediaQueries();

  const { allPages } = useAllPages();

  const { currentPage } = Store.useState(state => ({
    currentPage: state.currentPage
  }))

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
      {allPages.map((page) =>
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
            onPress={() => Store.update(state => { state.currentPage = page.id })}
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
