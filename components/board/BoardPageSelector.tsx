import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import { Store } from "@/helpers/store";
import useAllPages from "@/hooks/api/useAllPages";
import useMediaQueries from "@/hooks/useMediaQueries";

type ButtonProps = {
  page: APIResponsePage;
};

const BoardPageButton = ({ page }: ButtonProps) => {
  return (
    // `group` + `group-hover:` replaces the old useHover() from
    // react-native-web-hooks.
    <TouchableOpacity
      className="group"
      key={page.id}
      onPress={() =>
        Store.update((state) => {
          state.currentPage = page.id;
        })
      }
    >
      <CustomText className="border rounded-xl text-lg px-2 border-black group-hover:border-gray-600 group-hover:text-gray-600">
        {page.name}
      </CustomText>
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
      className={`flex-row flex-wrap gap-2 mt-2 ${isSm ? "px-6" : "px-0 mx-2"}`}
    >
      {allPages.map((page) =>
        page.id === currentPage ? (
          <View key={page.id} className="rounded-xl bg-green-600">
            <CustomText className="text-lg px-2 text-white rounded-xl">
              {page.name}
            </CustomText>
          </View>
        ) : (
          <BoardPageButton page={page} key={page.id} />
        ),
      )}
    </View>
  );
};

export default memo(BoardPageSelector);
