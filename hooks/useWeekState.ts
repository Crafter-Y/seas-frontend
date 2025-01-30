import { useCallback, useEffect, useState } from "react";
import { weekNumber, weeksPerYear } from "weeknumber";

export default function useWeekState() {
  const [internalYear, setInternalYear] = useState(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState(weekNumber(new Date()));

  const getPrev = useCallback(() => {
    if (currentWeek !== 1) return currentWeek - 1;
    return weeksPerYear(internalYear - 1);
  }, [currentWeek, internalYear]);

  const getNext = useCallback(() => {
    if (currentWeek !== weeksPerYear(internalYear)) return currentWeek + 1;
    return 1;
  }, [currentWeek, internalYear]);

  const initPrevWeek = getPrev();
  const initNextWeek = getNext();

  const [beforeWeek, setBeforeWeek] = useState(initPrevWeek);
  const [nextWeek, setNextWeek] = useState(initNextWeek);

  useEffect(() => {
    if (currentWeek > weeksPerYear(internalYear))
      setCurrentWeek(currentWeek - 1);
    setBeforeWeek(getPrev());
    setNextWeek(getNext());
  }, [currentWeek, internalYear]);

  useEffect(() => {
    setBeforeWeek(getPrev());
    setNextWeek(getNext());
  }, [currentWeek]);

  return { beforeWeek, currentWeek, nextWeek, setCurrentWeek, setInternalYear };
}
