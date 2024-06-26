import { Text, TouchableOpacity, View } from "react-native";
import React, { memo, useRef } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { Store } from "@/helpers/store";
import useAllPages from "@/hooks/api/useAllPages";
import { useHover } from "react-native-web-hooks";

type ButtonProps = {
  page: APIResponsePage;
};

const BoardPageButton = ({ page }: ButtonProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <TouchableOpacity
      ref={ref}
      key={page.id}
      onPress={() =>
        Store.update((state) => {
          state.currentPage = page.id;
        })
      }
    >
      <Text
        style={tw.style(
          {
            "border-black": !isHovered,
            "border-gray-600": isHovered,
            "text-gray-600": isHovered,
          },
          "border rounded-xl text-lg px-2"
        )}
      >
        {page.name}
      </Text>
    </TouchableOpacity>
  );
};

const BoardPageSelector = () => {
  const { isSm } = useMediaQueries();

  const { allPages } = useAllPages();

  const { currentPage } = Store.useState((state) => ({
    currentPage: state.currentPage,
  }));

  return (
    <View
      style={tw.style(
        {
          "px-0": !isSm,
          "px-6": isSm,
          "mx-2": !isSm,
        },
        "flex-row flex-wrap gap-2 mt-2"
      )}
    >
      {allPages.map((page) =>
        page.id == currentPage ? (
          <View key={page.id} style={tw`rounded-xl bg-green-600`}>
            <Text
              style={tw.style(
                {
                  borderRadius: 12,
                },
                "text-lg px-2 text-white"
              )}
            >
              {page.name}
            </Text>
          </View>
        ) : (
          <BoardPageButton page={page} key={page.id} />
        )
      )}
    </View>
  );
};

export default memo(BoardPageSelector);
