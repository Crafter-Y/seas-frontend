import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { BoardType } from "@/app/board";
import BoardList from "@/components/board/BoardList";
import BoardPageSelector from "@/components/board/BoardPageSelector";
import BoardRangePicker from "@/components/board/BoardRangePicker";
import Divider from "@/components/elements/Divider";
import RoundIconButton from "@/components/RoundIconButton";
import { Store } from "@/helpers/store";
import useAllPages from "@/hooks/api/useAllPages";
import useBoard from "@/hooks/api/useBoard";
import useModuleStatus from "@/hooks/api/useModuleStatus";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";

type Props = {
  boardType: BoardType;
  openCalendarModal?: () => void;
  openPrintModal?: () => void;
  openMusicModal?: () => void;
};

const Board = ({
  boardType,
  openCalendarModal,
  openPrintModal,
  openMusicModal,
}: Props) => {
  const { isSm, isLg } = useMediaQueries();

  const { allPages } = useAllPages();

  const { moduleStatus } = useModuleStatus();

  const { rows, queryBoard } = useBoard();

  const today = new Date();
  const thisQuarter = Math.floor(today.getMonth() / 3);
  const startThisQuarter = new Date(today.getFullYear(), thisQuarter * 3, 1);
  const endThisQuarter = new Date(
    startThisQuarter.getFullYear(),
    startThisQuarter.getMonth() + 3,
    0,
  );
  const [dateStart, setDateStart] = useState<Date>(startThisQuarter);
  const [dateEnd, setDateEnd] = useState<Date>(endThisQuarter);

  const fetchData = useCallback(
    (start: Date, end: Date) => {
      setDateStart(start);
      setDateEnd(end);

      queryBoard(start, end);
      console.log("query", start, end);
    },
    [queryBoard],
  );

  useEffect(() => {
    if (allPages.length !== 0) {
      Store.update((state) => {
        state.currentPage = allPages[0].id;
      });
    }
  }, [allPages]);

  return (
    <View
      style={tw.style(
        {
          "mx-2": !isSm,
          "mx-4": isSm,
        },
        "bg-white mt-4 shadow-lg",
      )}
    >
      <BoardRangePicker boardType={boardType} queryPageChange={fetchData} />
      <BoardPageSelector />
      <Divider
        type="HORIZONTAL"
        style={tw.style("mt-2", {
          "mx-0": !isSm,
          "mx-6": isSm,
          "mb-6": isLg,
        })}
      />

      <View
        style={tw.style(
          {
            hidden: isLg,
          },
          "flex-row gap-2 m-2",
        )}
      >
        <RoundIconButton
          hidden={!moduleStatus?.moduleCalendar}
          className="border border-gray-400"
          icon={<AntDesign name="calendar" size={20} color="black" />}
          onPress={openCalendarModal}
        />
        <RoundIconButton
          hidden={!moduleStatus?.modulePrint}
          className="border border-gray-400"
          icon={<AntDesign name="printer" size={20} color="black" />}
          onPress={openPrintModal}
        />
        <RoundIconButton
          hidden={!moduleStatus?.moduleMusic}
          className="border border-gray-400"
          icon={
            <MaterialCommunityIcons
              name="music-clef-treble"
              size={20}
              color="black"
            />
          }
          onPress={openMusicModal}
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
