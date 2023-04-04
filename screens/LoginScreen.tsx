import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { Button, Input } from "@rneui/base";
import tw from "../tailwind";
import { useTailwind } from "tailwind-rn/dist";

const LoginScreen = () => {
  const ctw = useTailwind();
  return (
    <SafeAreaView style={tw`bg-lightgrayNeutral`}>
      <View>
        <View style={tw`flex h-screen w-full`}>
          <View
            style={ctw(
              `h-screen md:flex flex-grow items-center gap-4 flex-col hidden`
            )}
          >
            <Text style={tw`text-4xl font-semibold mt-[10%]`}>Willkommen!</Text>
            <Text style={tw`text-2xl`}>Pagetitle</Text>
          </View>
          <View
            style={tw`md:bg-white h-screen flex flex-col md:justify-center items-center border-l border-gray-200 shadow-lg md:w-96 w-full px-4`}
          >
            <Text style={tw`text-4xl font-semibold mt-12 md:hidden`}>
              Willkommen!
            </Text>
            <Text style={tw`text-2xl md:hidden text-center`}>Pagetitle</Text>
            <View style={tw`divider my-8 md:hidden`}></View>
            <Text
              style={tw`text-4xl font-bold opacity-95 underline decoration-blueAccent underline-offset-4 decoration-2 md:mb-12`}
            >
              Login
            </Text>
            <View
              style={tw`mt-4 flex flex-col gap-2 w-full md:w-auto px-2 sm:px-20 md:px-0`}
            >
              <Input
                placeholder="Email"
                style={tw`border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg 
                      focus-visible:outline-none hover:border-opacity-40 ease-in-out duration-100`}
              ></Input>
              <Input
                placeholder="Passwort"
                style={tw`border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg 
                      focus-visible:outline-none hover:border-opacity-40 ease-in-out duration-100`}
              ></Input>

              <Button
                style={tw`btn bg-blueAccent rounded-xl text-xl px-4 py-2 font-semibold normal-case hover:opacity-70`}
              ></Button>
            </View>
            <Text
              style={tw`text-2xs opacity-80 w-full text-center print:hidden mt-12`}
            >
              &copy; Helmut Haase 2022
            </Text>
            <Text
              style={tw`text-2xs opacity-80 w-full text-center print:hidden`}
            >
              <Text style={tw`underline`}>Impressum</Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
