import { View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { BoardScreenProps, BoardType } from "@/screens/BoardScreen";
import BoardRangePicker from "./BoardRangePicker";
import BoardList from "./BoardList";
import useAllPages from "@/hooks/api/useAllPages";
import BoardPageSelector from "./BoardPageSelector";
import Divider from "./elements/Divider";

type Props = {
  boardType: BoardType;
  navigation: BoardScreenProps;
};

const Board = ({ boardType, navigation }: Props) => {
  const { isSm } = useMediaQueries();

  const { allPages } = useAllPages();

  const today = new Date();
  const thisQuarter = Math.floor(today.getMonth() / 3);
  const startThisQuarter = new Date(today.getFullYear(), thisQuarter * 3, 1);
  const endThisQuarter = new Date(
    startThisQuarter.getFullYear(),
    startThisQuarter.getMonth() + 3,
    0
  );
  const [dateStart, setDateStart] = useState<Date>(startThisQuarter);
  const [dateEnd, setDateEnd] = useState<Date>(endThisQuarter);

  const [currentPage, setCurrentPage] = useState("0");

  useEffect(() => {
    if (allPages.length != 0) {
      setCurrentPage(allPages[0].pageId);
    }
  }, [allPages]);

  return (
    <View
      style={tw.style(
        {
          "mx-2": !isSm,
          "mx-4": isSm,
        },
        "bg-white mt-4 shadow-lg"
      )}
    >
      <BoardRangePicker
        boardType={boardType}
        setDateStart={setDateStart}
        setDateEnd={setDateEnd}
      />
      <BoardPageSelector
        pages={allPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Divider
        type="HORIZONTAL"
        style={tw.style(`mt-2 mb-6`, {
          "mx-0": !isSm,
          "mx-6": isSm,
        })}
      />
      <BoardList
        dateStart={dateStart}
        dateEnd={dateEnd}
        currentPage={currentPage}
        navigation={navigation}
        allPages={allPages}
      />
    </View>
  );
};

export default Board;
