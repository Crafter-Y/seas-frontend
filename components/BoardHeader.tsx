import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import tw from "../tailwind";
import useMediaQueries from "../hooks/useMediaQueries";
import useServerName from "../hooks/useServerName";
import { Image } from "expo-image";
import { useHover } from "react-native-web-hooks";
import Modal from "react-native-modal";
import { Platform } from "react-native";
import BoardMenuNavigationButton from "./BoardMenuNavigationButton";
import { BoardType } from "../screens/BoardScreen";
import BoardSidebarButton from "./BoardSidebarButton";
import BoardMenuButton from "./BoardMenuButton";

const BoardHeader = (props: {
  user: User | null;
  boardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
  logout: () => void;
}) => {
  const { isLg, isSm } = useMediaQueries();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const isHovered1 = useHover(ref1);
  const isHovered2 = useHover(ref2);
  const isHovered3 = useHover(ref3);

  const [isMenuOpen, setMenuOpen] = useState(false);

  const { height, width } = useWindowDimensions();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const { serverName } = useServerName();

  return (
    <View
      style={tw.style(
        {
          "px-4": isLg,
          "mt-6": isLg,
        },
        `w-full`
      )}
    >
      <View
        style={tw`flex bg-white shadow-lg items-center justify-between px-2 h-16 flex-row`}
      >
        <Text
          style={tw.style(
            {
              "text-xl": isLg,
              "text-lg": !isLg,
              "ml-4": isLg,
            },
            "font-bold"
          )}
        >
          {serverName}
        </Text>
        <View
          style={tw.style(
            {
              flex: isLg,
              hidden: !isLg,
            },
            "flex-row gap-2"
          )}
        >
          <Pressable
            style={tw.style(
              {
                "bg-lightgrayNeutral": isHovered1,
              },
              `flex items-center justify-center h-10 w-10 rounded-full`
            )}
            ref={ref1}
            onPress={() => {}}
          >
            <Image
              source={require("../assets/img/calendar.svg")}
              style={tw`h-4 w-4`}
            />
          </Pressable>
          <Pressable
            style={tw.style(
              {
                "bg-lightgrayNeutral": isHovered2,
              },
              `flex items-center justify-center h-10 w-10 rounded-full`
            )}
            ref={ref2}
            onPress={() => {}}
          >
            <Image
              source={require("../assets/img/print.svg")}
              style={tw`h-4 w-4`}
            />
          </Pressable>
        </View>
        <Pressable
          style={tw.style(
            {
              "bg-lightgrayNeutral": isHovered3,
              flex: !isLg,
              hidden: isLg,
            },
            `items-center justify-center h-10 w-10 rounded-full`
          )}
          ref={ref3}
          onPress={toggleMenu}
        >
          <Image
            source={require("../assets/img/menu.svg")}
            style={tw`h-4 w-4`}
          />
        </Pressable>
        <Modal
          isVisible={isMenuOpen && !isLg}
          onBackdropPress={toggleMenu}
          style={tw.style(
            {
              "justify-end": Platform.OS != "web",
              "justify-center": Platform.OS == "web",
            },
            "m-0 flex items-center"
          )}
          swipeDirection={["down"]}
          onSwipeComplete={toggleMenu}
          customBackdrop={
            <TouchableOpacity
              style={tw.style(
                {
                  height,
                  width,
                },
                "bg-opacity-35 bg-black"
              )}
              onPress={toggleMenu}
            ></TouchableOpacity>
          }
        >
          <View
            style={tw.style(
              {
                "w-1/2": Platform.OS == "web",
                "rounded-md": Platform.OS == "web",
                "rounded-t-xl": Platform.OS != "web",
                width:
                  Platform.OS == "web"
                    ? isSm
                      ? width / 2
                      : width * 0.75
                    : width,
              },
              `bg-white shadow-lg`
            )}
          >
            <Text
              style={tw`w-full text-center px-2 text-lg font-semibold mt-6`}
            >
              {props.user?.firstname} {props.user?.lastname}
            </Text>
            <Text style={tw`w-full text-center px-2 text-sm mb-4`}>
              {props.user?.email}
            </Text>
            <View
              style={tw.style(
                ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mx-2 my-2`
              )}
            />

            <BoardMenuNavigationButton
              boardType="Jahresansicht"
              currentBoardType={props.boardType}
              setBoardType={props.setBoardType}
              closeModal={toggleMenu}
            />
            <BoardMenuNavigationButton
              boardType="Quartal Ansicht"
              currentBoardType={props.boardType}
              setBoardType={props.setBoardType}
              closeModal={toggleMenu}
            />
            <BoardMenuNavigationButton
              boardType="Monatsansicht"
              currentBoardType={props.boardType}
              setBoardType={props.setBoardType}
              closeModal={toggleMenu}
            />
            <BoardMenuNavigationButton
              boardType="Wochenansicht"
              currentBoardType={props.boardType}
              setBoardType={props.setBoardType}
              closeModal={toggleMenu}
            />
            <View
              style={tw.style(
                ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mx-2`
              )}
            />
            <BoardMenuButton
              icon={require("../assets/img/settings.svg")}
              text={"Einstellungen"}
              pressAction={() => {}}
            />
            <View
              style={tw.style(
                ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mx-2`
              )}
            />
            <BoardMenuButton
              icon={require("../assets/img/changepassword.svg")}
              text={"Passwort ändern"}
              pressAction={() => {}}
            />
            <View
              style={tw.style(
                ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mx-2`
              )}
            />
            <BoardMenuButton
              icon={require("../assets/img/logout.svg")}
              text={"Abmelden"}
              pressAction={props.logout}
            />
            <View
              style={tw.style({
                "h-3": Platform.OS != "web",
              })}
            ></View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default BoardHeader;
