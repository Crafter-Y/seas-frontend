import H2 from "@/components/elements/H2";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";

type Props = {
  children?: React.ReactNode;
};

const SettingsTitle = ({ children }: Props) => {
  const { isMd } = useMediaQueries();

  return (
    <H2
      style={tw.style({
        "text-center": !isMd,
      })}
    >
      {children}
    </H2>
  );
};

export default SettingsTitle;
