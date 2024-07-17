import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import { Color } from "@/helpers/Constants";
import useMusicSearch from "@/hooks/api/useMusicSearch";
import tw from "@/tailwind";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SegmentedButtons } from "react-native-paper";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";

type Props = {
  closeModal?: () => void;
  openEntryDateModal?: () => void;
  openRatingsModal?: () => void;
};

export default function MusicSelectSongModal({
  closeModal,
  openEntryDateModal,
  openRatingsModal,
}: Props) {
  const { songs, querySongs } = useMusicSearch();
  const musicDate = Store.useState((state) => state.musicDate);

  const heightAnimate = useRef(new Animated.Value(128)).current;

  const [searchType, setSearchType] = useState<"NUMBER" | "TITLE">("NUMBER");

  useEffect(() => {
    if (songs.length > 5) {
      Animated.timing(heightAnimate, {
        toValue: 256,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnimate, {
        toValue: 128,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [songs]);

  return (
    <View style={tw`mx-2 md:mx-4 mb-2`}>
      <Text style={tw`text-lg font-semibold mb-1`}>
        {prettyDate(formatDate(musicDate!), false)}
      </Text>
      <SegmentedButtons
        value={searchType}
        onValueChange={(text) => setSearchType(text as "NUMBER" | "TITLE")}
        buttons={[
          {
            value: "NUMBER",
            label: "Nummer",
            icon: ({ size, color }) => (
              <AntDesign name="slack" size={size} color={color} />
            ),
          },
          {
            value: "TITLE",
            label: "Titel",
            icon: ({ size, color }) => (
              <AntDesign name="book" size={size} color={color} />
            ),
          },
        ]}
      />

      <Input
        placeholder={
          searchType == "NUMBER" ? "Nummer eingeben" : "Titel eingeben"
        }
        inputMode={searchType == "NUMBER" ? "numeric" : "text"}
        onChangeText={(text) => querySongs(text)}
        autoFocus
        style={tw`mt-2`}
      />
      <Animated.View
        style={{
          height: heightAnimate,
          marginVertical: 4,
        }}
      >
        <FlashList
          ListHeaderComponent={
            songs.length ? undefined : (
              <Text>Tippen, damit Ergebnisse erscheinen</Text>
            )
          }
          estimatedItemSize={50}
          data={songs}
          renderItem={({ item, index }) => {
            return (
              <View
                style={tw`border-b-2 p-1 flex-row gap-2 border-[${
                  Color.GRAY
                }] ${index == 0 ? "border-t-2" : ""} ${
                  index % 2 == 0 ? "bg-gray-100" : ""
                }`}
              >
                <View style={tw`w-4/5`}>
                  <Text style={tw`text-lg leading-[18px]`}>
                    {item.title} ({item.number})
                  </Text>
                  <Text style={tw`text-xs`}>{item.book.name}</Text>
                </View>
                <View style={tw`w-1/5 flex-1 items-center justify-center`}>
                  <TouchableOpacity
                    onPress={() => {
                      Store.update((state) => {
                        state.musicSongSelected = item;
                      });
                      closeModal?.();
                      openRatingsModal?.();
                    }}
                  >
                    <AntDesign name="check" size={32} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </Animated.View>
      <Button
        onPress={() => {
          closeModal?.();
          openEntryDateModal?.();
        }}
      >
        Zurück
      </Button>
    </View>
  );
}
