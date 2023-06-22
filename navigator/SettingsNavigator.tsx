import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React, { useEffect } from "react";
import {
  DefaultNavigatorOptions,
  ParamListBase,
  StackActionHelpers,
  StackNavigationState,
  StackRouter,
  StackRouterOptions,
  createNavigatorFactory,
  useNavigation,
  useNavigationBuilder,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackView,
} from "@react-navigation/native-stack";
import useMediaQueries from "../hooks/useMediaQueries";
import tw from "../tailwind";
import { Image } from "expo-image";
import Footer from "../components/Footer";
import {
  RootStackParamList,
  settingsScreens,
  settingsTitles,
} from "./RootNavigator";

type Props = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap
> &
  StackRouterOptions;

export type SettingsNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "SettingsNavigator"
>;

const SettingsNavigator = ({
  id,
  initialRouteName,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: Props) => {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      NativeStackNavigationOptions,
      NativeStackNavigationEventMap
    >(StackRouter, {
      id,
      initialRouteName,
      children,
      screenListeners,
      screenOptions,
    });

  const rootNavigation = useNavigation<SettingsNavigationProps>();

  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

  const getRouteName = () => {
    return navigation.getState().routes[navigation.getState().routes.length - 1]
      .name;
  };

  useEffect(() => {
    rootNavigation.setOptions({ title: "Einstellungen" });
    if (!isMd && getRouteName() == "BaseSettingsScreen") {
      rootNavigation.setOptions({ headerShown: true });
    } else {
      rootNavigation.setOptions({ headerShown: false });
    }
  }, [isMd, rootNavigation]);

  return (
    <NavigationContent>
      <SafeAreaView style={{ flexDirection: "row" }}>
        <View
          style={tw.style(
            {
              flex: isMd,
              hidden: !isMd,
              height,
            },
            "w-1/3 items-end justify-center pl-4"
          )}
        >
          <View style={tw.style({}, "flex-row gap-1 items-center mb-4")}>
            <Image
              source={require("../assets/img/previous.svg")}
              style={tw`h-4 w-4`}
            />
            <Pressable onPress={() => rootNavigation.navigate("BoardScreen")}>
              <Text style={tw.style("font-semibold underline")}>Zurück</Text>
            </Pressable>
          </View>
          <Text
            style={tw.style(
              {},
              "text-4xl font-bold opacity-95 underline text-right mb-2"
            )}
          >
            Einstellungen
          </Text>
          {Object.keys(settingsScreens).map((setting) => (
            <View
              style={tw.style("items-center mt-2 gap-3 flex-row -mr-2")}
              key={setting}
            >
              <View></View>
              <Pressable
                style={tw.style("hover:underline hover:opacity-80")}
                onPress={() => navigation.navigate(setting)}
              >
                <Text style={tw.style("font-semibold")}>
                  {settingsTitles[setting as keyof typeof settingsScreens]}
                </Text>
              </Pressable>
              <View
                style={tw.style(
                  {
                    "bg-gray-300": getRouteName() != setting,
                    "bg-blueAccent": getRouteName() == setting,
                  },
                  "w-1 h-8 rounded-l-md"
                )}
              ></View>
            </View>
          ))}
          <Footer
            navigation={rootNavigation}
            style={tw.style(
              {
                hidden: !isMd,
              },
              "w-48 mt-12"
            )}
          />
        </View>
        <View
          style={tw.style(
            {
              hidden: !isMd,
            },
            "my-16 bg-[#e0e2e5] w-0.5 mx-2"
          )}
        ></View>
        <View
          style={tw.style(
            {
              "py-14": isMd,
            },
            "flex-grow"
          )}
        >
          <NativeStackView
            {...rest}
            state={state}
            navigation={navigation}
            descriptors={descriptors}
          />
          <Text style={{ width: "300px" }}></Text>
        </View>
      </SafeAreaView>
    </NavigationContent>
  );
};

export const createSettingsNavigator =
  createNavigatorFactory(SettingsNavigator);
