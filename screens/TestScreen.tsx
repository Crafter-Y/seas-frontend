import { Text, SafeAreaView } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";

const TestScreen = () => {
  const tw = useTailwind();

  return (
    <SafeAreaView>
      <Text style={tw("text-red-500")}>
        Open up App.tsx to start working on your app!
      </Text>
    </SafeAreaView>
  );
};

export default TestScreen;
