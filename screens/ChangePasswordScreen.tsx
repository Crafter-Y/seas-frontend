import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import { RootStackParamList } from "../navigator/RootNavigator";
import tw from "../tailwind";
import useMediaQueries from "../hooks/useMediaQueries";

type ChangePasswordScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePasswordScreen"
>;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<ChangePasswordScreenProps>();
  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

  useEffect(() => {
    navigation.setOptions({
      title: "Passwort ändern",
      headerTitle: "Zurück",
      headerShown: !isMd,
    });
  }, [navigation, isMd]);

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <View
        style={tw.style(
          {
            flex: isMd,
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center flex-col pl-4"
        )}
      >
        <View
          style={tw.style({}, "flex gap-1 items-center mb-4 hover:opacity-75")}
        >
          {/*<img src="" alt="" height="16px" width="16px">*/}
          <Text style={tw.style("font-semibold underline")}>Zurück</Text>
        </View>
        <Text
          style={tw.style(
            {},
            "text-4xl font-bold opacity-95 underline decoration-blueAccent underline-offset-4 decoration-2 text-right"
          )}
        >
          Passwort ändern
        </Text>
        <Text style={tw.style({}, "text-right mt-4 ml-4")}>
          Das vergebene Standartpasswort ist recht unsicher. Deshalb sollte es
          geändert werden. Das neue Passwort muss mindestens 7 Zeichen haben.
          Erlaubt sind Buchstaben, Zahlen und Sonderzeichen: -_!?/*%$
        </Text>
        {/*<View style={tw.style({}, "w-48 mt-12">Footer</View>*/}
      </View>
      <View
        style={tw.style(
          {
            hidden: !isMd,
          },
          "my-16 bg-[#e0e2e5] w-0.5 mx-5"
        )}
      ></View>
      <View
        style={tw.style(
          {
            "justify-center": isMd,
          },
          "flex w-full"
        )}
      >
        <Text
          style={tw.style(
            {
              hidden: isMd,
            },
            "text-4xl font-bold opacity-95 underline text-center mt-6 mb-12"
          )}
        >
          Passwort ändern
        </Text>
        <View
          style={tw.style(
            {},
            "flex flex-col gap-2 md:w-72 px-6 sm:px-24 md:px-0"
          )}
        >
          {/*<input type="password" name="recentPassword" placeholder="Vorheriges Passwort" 
                style={tw.style({}, "border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg focus-visible:outline-none hover:border-opacity-40 ease-in-out duration-100")}>
            <input type="password" name="newPassword1" placeholder="Neues Passwort festlegen" 
                style={tw.style({}, "border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg focus-visible:outline-none hover:border-opacity-40 ease-in-out duration-100")}>
            <input type="password" name="newPassword2" placeholder="Passwort wiederholen"
                style={tw.style({}, "border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg focus-visible:outline-none hover:border-opacity-40 ease-in-out duration-100")}>
          */}
          <Text>Real Page Contents</Text>
          <View style={tw.style({}, "flex gap-1 items-center")}>
            <Text>{/*<img src="" alt="" height="20px" width="20px">*/}</Text>
            {/** Error Message */}
          </View>

          {/*<input type="submit" value="Passwort ändern" name="passwordChangeForm" style={tw.style({}, "btn bg-blueAccent rounded-xl text-xl px-4 py-2 font-semibold normal-case hover:opacity-70")}>*/}
        </View>
        <View style={tw.style({}, "mt-2 md:hidden")}>{/*Footer*/}</View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
