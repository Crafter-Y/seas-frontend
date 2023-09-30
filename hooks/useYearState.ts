import { useEffect, useState } from "react";

export default function useYearState() {
  const [beforeYear, setBeforeYear] = useState(new Date().getFullYear() - 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [nextYear, setNextYear] = useState(new Date().getFullYear() + 1);

  useEffect(() => {
    const beforeYear = currentYear == 2000 ? 2045 : currentYear - 1;
    const nextYear = currentYear == 2045 ? 2000 : currentYear + 1;
    setBeforeYear(beforeYear);
    setNextYear(nextYear);
  }, [currentYear]);

  return { beforeYear, currentYear, nextYear, setCurrentYear };
}
