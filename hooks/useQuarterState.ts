import { useEffect, useState } from "react";

export default function useQuarterState() {
  const initQuarter = Math.floor((new Date().getMonth() + 3) / 3);
  const initPrevQuarter = initQuarter === 1 ? 4 : initQuarter - 1;
  const initNextQuarter = initQuarter === 4 ? 1 : initQuarter + 1;

  const [beforeQuarter, setBeforeQuarter] = useState(initPrevQuarter);
  const [currentQuarter, setCurrentQuarter] = useState(initQuarter);
  const [nextQuarter, setNextQuarter] = useState(initNextQuarter);

  useEffect(() => {
    const beforeQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
    const nextQuarter = currentQuarter === 4 ? 1 : currentQuarter + 1;
    setBeforeQuarter(beforeQuarter);
    setNextQuarter(nextQuarter);
  }, [currentQuarter]);

  return { beforeQuarter, currentQuarter, nextQuarter, setCurrentQuarter };
}
