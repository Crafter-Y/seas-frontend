import { useMediaQuery } from "react-responsive";

export default function useMediaQueries() {
  const isSm = useMediaQuery({
    minWidth: 640,
  });

  const isMd = useMediaQuery({
    minWidth: 768,
    minHeight: 440,
  });

  const isLg = useMediaQuery({
    minWidth: 1024,
    minHeight: 480,
  });

  const isXl = useMediaQuery({
    minWidth: 1280,
  });

  const is2Xl = useMediaQuery({
    minWidth: 1536,
  });

  return { isSm, isMd, isLg, isXl, is2Xl };
}
