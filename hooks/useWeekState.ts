import { useEffect, useState } from "react";
import { weekNumber, weeksPerYear } from "weeknumber";

export default function useWeekState(initYear: number) {
  const [internalYear, setInternalYear] = useState(initYear);

  const getPrev = () => {
    if (currentWeek != 1) return currentWeek - 1;
    return weeksPerYear(internalYear - 1);
  };

  const getNext = () => {
    if (currentWeek != weeksPerYear(internalYear)) return currentWeek + 1;
    return 1;
  };

  const initPrevWeek = getPrev();
  const initNextWeek = getNext();

  const [beforeWeek, setBeforeWeek] = useState(initPrevWeek);
  const [currentWeek, setCurrentWeek] = useState(weekNumber(new Date()));
  const [nextWeek, setNextWeek] = useState(initNextWeek);

  useEffect(() => {
    if (currentWeek > weeksPerYear(internalYear))
      setCurrentWeek(currentWeek - 1);
    setBeforeWeek(getPrev());
    setNextWeek(getNext());
  }, [internalYear]);

  useEffect(() => {
    const beforeWeek = getPrev();
    const nextWeek = getNext();
    setBeforeWeek(beforeWeek);
    setNextWeek(nextWeek);
  }, [currentWeek]);

  return { beforeWeek, currentWeek, nextWeek, setCurrentWeek, setInternalYear };
}
