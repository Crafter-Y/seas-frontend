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
import BoardHeaderRoundButton from "./BoardHeaderRoundButton";
import useModuleStatus from "@/hooks/api/useModuleStatus";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

type Props = {
  boardType: BoardType;
  rows: BoardRow[];
  queryBoard: (fromDate: string, toDate: string) => Promise<void>
};

const Board = ({ boardType, rows, queryBoard }: Props) => {
  const { isSm, isLg } = useMediaQueries();

  const { allPages } = useAllPages();

  const { moduleStatus } = useModuleStatus();

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
        style={tw.style("mt-2", {
          "mx-0": !isSm,
          "mx-6": isSm,
        })}
      />

      <View
        style={tw.style(
          {
            hidden: isLg,
          },
          "flex-row gap-2 m-2"
        )}
      >
        <BoardHeaderRoundButton
          style={tw.style({
            "hidden": !moduleStatus?.moduleCalendar
          }, "border border-gray-400")}
          imageSource={require("@/assets/img/calendar.svg")}
          onPress={() => {
            router.push("/modules/calendar");
          }}
        />
        <BoardHeaderRoundButton
          style={tw.style({
            "hidden": !moduleStatus?.modulePrint
          }, "border border-gray-400")}
          imageSource={require("@/assets/img/print.svg")}
          onPress={() => Toast.show({
            type: "error",
            text1: "Noch nicht implementiert",
            text2: "Diese Funktion ist noch nicht implementiert",
          })}
        />
      </View>
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
