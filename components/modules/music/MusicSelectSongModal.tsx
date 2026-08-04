import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Input from "@/components/elements/Input";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import useMusicSearch from "@/hooks/api/useMusicSearch";

type Props = {
  closeModal: () => void;
  openEntryDateModal: () => void;
  openRatingsModal: () => void;
};

export default function MusicSelectSongModal({
  closeModal,
  openEntryDateModal,
  openRatingsModal,
}: Props) {
  const { songs, querySongs } = useMusicSearch();
  const musicDate = Store.useState((state) => state.musicDate);

  const [heightAnimate] = useState(() => new Animated.Value(128));

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
  }, [heightAnimate, songs]);

  return (
    <View className="mx-2 md:mx-4 mb-2">
      <CustomText className="text-lg font-semibold mb-1">
        {prettyDate(formatDate(musicDate!), false)}
      </CustomText>
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
          searchType === "NUMBER" ? "Nummer eingeben" : "Titel eingeben"
        }
        inputMode={searchType === "NUMBER" ? "numeric" : "text"}
        onChangeText={(text) => querySongs(text)}
        autoFocus
        className="mt-2"
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
              <CustomText>Tippen, damit Ergebnisse erscheinen</CustomText>
            )
          }
          data={songs}
          renderItem={({ item, index }) => {
            return (
              <View
                className={`border-b-2 p-1 flex-row gap-2 border-seas-gray ${index === 0 ? "border-t-2" : ""} ${
                  index % 2 === 0 ? "bg-gray-100" : ""
                }`}
              >
                <View className="w-4/5">
                  <CustomText className="text-lg leading-[18px]">
                    {item.title} ({item.number})
                  </CustomText>
                  <CustomText className="text-xs">{item.book.name}</CustomText>
                </View>
                <View className="w-1/5 flex-1 items-center justify-center">
                  <TouchableOpacity
                    onPress={() => {
                      Store.update((state) => {
                        state.musicSongSelected = item;
                      });
                      closeModal();
                      openRatingsModal();
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
          closeModal();
          openEntryDateModal();
        }}
      >
        Zurück
      </Button>
    </View>
  );
}
