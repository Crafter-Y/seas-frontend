import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "../tailwind";
import useMediaQueries from "../hooks/useMediaQueries";
import { BoardType } from "../screens/BoardScreen";
import BoardRangePicker from "./BoardRangePicker";
import BoardList from "./BoardList";

type Props = {
  boardType: BoardType;
};

const Board = ({ boardType }: Props) => {
  const { isSm } = useMediaQueries();

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

  useEffect(() => {
    console.log(dateStart, dateEnd);
  }, [dateStart, dateEnd]);

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
      <BoardList dateStart={dateStart} dateEnd={dateEnd} />
    </View>
  );
};

export default Board;
