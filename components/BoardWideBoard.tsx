import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React from "react";
import tw from "../tailwind";
import useMediaQueries from "../hooks/useMediaQueries";
import { BoardType } from "../screens/BoardScreen";
import WideBoardMenu from "./WideBoardMenu";

const BoardWideBoard = (props: {
  user: User | null;
  boardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
}) => {
  const { isSm, isMd, isLg } = useMediaQueries();

  const { height } = useWindowDimensions();

  return (
    <View
      style={tw.style(
        "w-52 bg-white shadow-lg flex-col justify-between overflow-hidden hidden lg:flex",
        {
          height,
          flex: isLg,
          hidden: !isLg,
        }
      )}
    >
      <View style={tw.style("w-full ")}>
        <View style={tw`mt-6 px-2`}>
          <Text style={tw`text-sm`}>Hallo,</Text>
          <Text style={tw`font-semibold mt-1 opacity-85`}>
            {props.user?.firstname} {props.user?.lastname}
          </Text>
        </View>
        <View
          style={tw.style(
            ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mt-6 mb-2 mx-2`
          )}
        />
        <WideBoardMenu
          boardType="Jahresansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
        <WideBoardMenu
          boardType="Quartal Ansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
        <WideBoardMenu
          boardType="Monatsansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
        <WideBoardMenu
          boardType="Wochenansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
      </View>

      <View style={tw.style("w-full")}>
        <View
          style={tw.style(
            ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mt-6 mb-2 mx-2`
          )}
        />
      </View>
    </View>
  );
};

export default BoardWideBoard;
