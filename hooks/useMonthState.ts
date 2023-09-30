import { useEffect, useState } from "react";

export default function useMonthState() {
  const initMonth = new Date().getUTCMonth() + 1;
  const initPrevMonth = initMonth == 1 ? 12 : initMonth - 1;
  const initNextMonth = initMonth == 12 ? 1 : initMonth + 1;

  const [beforeMonth, setBeforeMonth] = useState(initPrevMonth);
  const [currentMonth, setCurrentMonth] = useState(initMonth);
  const [nextMonth, setNextMonth] = useState(initNextMonth);

  useEffect(() => {
    const beforeMonth = currentMonth == 1 ? 12 : currentMonth - 1;
    const nextMonth = currentMonth == 12 ? 1 : currentMonth + 1;
    setBeforeMonth(beforeMonth);
    setNextMonth(nextMonth);
  }, [currentMonth]);

  return { beforeMonth, currentMonth, nextMonth, setCurrentMonth };
}
