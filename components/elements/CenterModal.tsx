import { Platform, Pressable, useWindowDimensions, View } from "react-native";
import { router, Stack } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { useState } from "react";

type Props = {
  children?: React.ReactNode;
};

export default function CenterModal({ children }: Props) {
  const { height, width } = useWindowDimensions();
  const { isSm } = useMediaQueries();

  // use this to prevent immediate closing of the modal appearing when used in touch mode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastModalOpen, setLastModalOpen] = useState<Date>(new Date());

  return (
    <Pressable
      style={tw.style(
        { flex: 1, alignItems: "center", justifyContent: "center" },
        "bg-opacity-35 bg-black"
      )}
      onPress={() => {
        if (new Date().getTime() - lastModalOpen.getTime() < 200) return;

        router.back();
      }}
    >
      <Stack.Screen
        options={{
          presentation: "transparentModal",
        }}
      />
      <View style={{ maxHeight: height * 0.8 }}>
        <ScrollView
          style={tw.style(
            {
              flexGrow: 0,
              "w-1/2": Platform.OS == "web",
              width:
                Platform.OS == "web"
                  ? isSm
                    ? width / 2
                    : width * 0.75
                  : width,
            },
            "bg-white shadow-lg"
          )}
        >
          <Pressable>{children}</Pressable>
        </ScrollView>
      </View>
    </Pressable>
  );
}
