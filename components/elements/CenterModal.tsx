import { View, useWindowDimensions, Pressable, Platform } from "react-native";
import { Stack, router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";

type Props = {
  children?: React.ReactNode;
};

export default function CenterModal({ children }: Props) {
  const { height, width } = useWindowDimensions();
  const { isSm } = useMediaQueries();

  return (
    <Pressable
      style={tw.style(
        { flex: 1, alignItems: "center", justifyContent: "center" },
        "bg-opacity-35 bg-black"
      )}
      onPress={() => router.back()}
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
          {children}
        </ScrollView>
      </View>
    </Pressable>
  );
}
