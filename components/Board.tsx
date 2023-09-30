import { View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import BoardRangePicker from "./BoardRangePicker";
import BoardList from "./BoardList";
import useAllPages from "@/hooks/api/useAllPages";
import BoardPageSelector from "./BoardPageSelector";
import Divider from "./elements/Divider";
import { formatDate } from "@/helpers/format";
import { BoardType } from "@/app/board";
import { Store } from "@/helpers/store";

type Props = {
  boardType: BoardType;
  rows: BoardRow[];
  queryBoard: (fromDate: string, toDate: string) => Promise<void>
};

const Board = ({ boardType, rows, queryBoard }: Props) => {
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

  const fetchData = (start: Date, end: Date) => {
    setDateStart(start);
    setDateEnd(end);

    queryBoard(formatDate(start), formatDate(end));
    console.log("query", start, end);
  };

  useEffect(() => {
    if (allPages.length != 0) {
      Store.update(state => { state.currentPage = allPages[0].id; });
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
        queryPageChange={fetchData}
      />
      <BoardPageSelector />
      <Divider
        type="HORIZONTAL"
        style={tw.style("mt-2 mb-6", {
          "mx-0": !isSm,
          "mx-6": isSm,
        })}
      />
      <BoardList
        rows={rows}
        fetchData={() => {
          fetchData(dateStart, dateEnd);
        }}
      />
    </View>
  );
};

export default Board;
