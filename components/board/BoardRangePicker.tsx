import { Pressable, TouchableOpacity, View } from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import tw from "@/tailwind";
import useYearState from "@/hooks/useYearState";
import { Entypo } from "@expo/vector-icons";
import useQuarterState from "@/hooks/useQuarterState";
import useMonthState from "@/hooks/useMonthState";
import useMediaQueries from "@/hooks/useMediaQueries";
import useWeekState from "@/hooks/useWeekState";
import { Color } from "@/helpers/Constants";
import { BoardType } from "@/app/board";
import CustomText from "../elements/CustomText";

type Props = {
  boardType: BoardType;
  queryPageChange: (from: Date, to: Date) => void;
};

const BoardRangePicker = ({ boardType, queryPageChange }: Props) => {
  const { beforeYear, currentYear, nextYear, setCurrentYear } = useYearState();
  const { beforeQuarter, currentQuarter, nextQuarter, setCurrentQuarter } =
    useQuarterState();
  const { beforeMonth, currentMonth, nextMonth, setCurrentMonth } =
    useMonthState();
  const { beforeWeek, currentWeek, nextWeek, setCurrentWeek, setInternalYear } =
    useWeekState();

  const [backText, setBackText] = useState("");
  const [nextText, setNextText] = useState("");

  const [thisText, setThisText] = useState("");

  const { isMd } = useMediaQueries();

  const getDateByWeek = (w: number, y: number) => {
    const simple = new Date(y, 0, 1 + (w - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
  };

  useEffect(() => {
    const months = [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ];

    setInternalYear(currentYear);
    if (boardType === "Jahresansicht") {
      setBackText(beforeYear + "");
      setNextText(nextYear + "");

      queryPageChange(
        new Date(currentYear, 0, 1),
        new Date(currentYear, 11, 31),
      );
    } else if (boardType === "Quartal Ansicht") {
      setBackText(beforeQuarter + ". Quartal");
      setNextText(nextQuarter + ". Quartal");
      setThisText(currentQuarter + ". Quartal");

      const startThisQuarter = new Date(
        currentYear,
        (currentQuarter - 1) * 3,
        1,
      );
      queryPageChange(
        startThisQuarter,
        new Date(currentYear, startThisQuarter.getMonth() + 3, 0),
      );
    } else if (boardType === "Monatsansicht") {
      setBackText(months[beforeMonth - 1]);
      setNextText(months[nextMonth - 1]);
      setThisText(months[currentMonth - 1]);

      queryPageChange(
        new Date(currentYear, currentMonth - 1, 1),
        new Date(currentYear, currentMonth, 0),
      );
    } else {
      setBackText("KW " + beforeWeek);
      setNextText("KW " + nextWeek);
      setThisText("KW " + currentWeek);

      const weekStart = getDateByWeek(currentWeek, currentYear);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      queryPageChange(weekStart, weekEnd);
    }
  }, [
    boardType,
    beforeYear,
    nextYear,
    beforeQuarter,
    nextQuarter,
    currentQuarter,
    beforeMonth,
    nextMonth,
    currentMonth,
    currentWeek,
    beforeWeek,
    nextWeek,
  ]);

  const backAction = useCallback(() => {
    if (boardType === "Jahresansicht") {
      setCurrentYear(beforeYear);
    } else if (boardType === "Quartal Ansicht") {
      setCurrentQuarter(beforeQuarter);
      if (beforeQuarter === 4) setCurrentYear(currentYear - 1);
    } else if (boardType === "Monatsansicht") {
      setCurrentMonth(beforeMonth);
      if (beforeMonth === 12) setCurrentYear(currentYear - 1);
    } else {
      if (beforeWeek > currentWeek) {
        setCurrentYear(currentYear - 1);
      }
      setCurrentWeek(beforeWeek);
    }
  }, [
    boardType,
    setCurrentYear,
    beforeYear,
    setCurrentQuarter,
    beforeQuarter,
    currentYear,
    setCurrentMonth,
    beforeMonth,
    beforeWeek,
    currentWeek,
    setCurrentWeek,
  ]);

  const nextAction = useCallback(() => {
    if (boardType === "Jahresansicht") {
      setCurrentYear(nextYear);
    } else if (boardType === "Quartal Ansicht") {
      setCurrentQuarter(nextQuarter);
      if (nextQuarter === 1) setCurrentYear(currentYear + 1);
    } else if (boardType === "Monatsansicht") {
      setCurrentMonth(nextMonth);
      if (nextMonth === 1) setCurrentYear(currentYear + 1);
    } else {
      setCurrentWeek(nextWeek);
      if (nextWeek === 1) setCurrentYear(currentYear + 1);
    }
  }, [
    boardType,
    setCurrentYear,
    nextYear,
    setCurrentQuarter,
    nextQuarter,
    currentYear,
    setCurrentMonth,
    nextMonth,
    setCurrentWeek,
    nextWeek,
  ]);

  const middleAction = () => {
    /*TODO: if (boardType == "Jahresansicht") {
    } else if (boardType == "Quartal Ansicht") {
    } else if (boardType == "Monatsansicht") {
    } else {
    }*/
    console.log("Not implemented");
  };

  return (
    <View style={tw`flex-row justify-center sm:gap-3 gap-1 items-center mt-4`}>
      <TouchableOpacity
        onPress={backAction}
        style={tw.style(
          {
            "w-32": isMd,
          },
          "flex-row items-center gap-2 justify-end",
        )}
      >
        <Entypo name="arrow-bold-left" size={16} color="black" />
        <CustomText className="underline" selectable={false} numberOfLines={1}>
          {backText}
        </CustomText>
      </TouchableOpacity>
      <Pressable
        style={tw`border rounded-sm px-2 py-1 bg-[${Color.GRAY}] items-center w-32`}
        onPress={middleAction}
      >
        {boardType === "Jahresansicht" && (
          <CustomText style={tw`text-lg font-semibold`} selectable={false}>
            {currentYear}
          </CustomText>
        )}
        {boardType !== "Jahresansicht" && (
          <>
            <CustomText selectable={false}>{currentYear}</CustomText>
            <CustomText style={tw`text-lg font-semibold`} selectable={false}>
              {thisText}
            </CustomText>
          </>
        )}
      </Pressable>

      <TouchableOpacity
        onPress={nextAction}
        style={tw.style(
          {
            "w-32": isMd,
          },
          "flex-row items-center gap-2 justify-start",
        )}
      >
        <CustomText style={tw`underline`} selectable={false} numberOfLines={1}>
          {nextText}
        </CustomText>
        <Entypo name="arrow-bold-right" size={16} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(BoardRangePicker);
