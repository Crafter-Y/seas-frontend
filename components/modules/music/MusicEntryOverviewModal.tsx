import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { use, useEffect, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Ratings from "@/components/elements/Ratings";
import { entryTypeMeanings } from "@/components/modules/music/MusicEntryTypeModal";
import { AppContext } from "@/helpers/appContext";
import { formatDate, prettyDate } from "@/helpers/format";
import useSaveSongEntries from "@/hooks/api/useSaveSongEntries";

type Props = {
  closeModal: () => void;
  openSelectSongModal: () => void;
};

export default function MusicEntryOverviewModal({
  closeModal,
  openSelectSongModal,
}: Props) {
  const { saveSongs } = useSaveSongEntries();

  const {
    musicDate,
    setMusicDate,
    musicRatings,
    setMusicRatings,
    musicEntryType,
    setMusicEntryType,
  } = use(AppContext);

  const [heightAnimate] = useState(() => new Animated.Value(128));

  useEffect(() => {
    if (musicRatings.length > 2) {
      Animated.timing(heightAnimate, {
        toValue: 384,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnimate, {
        toValue: 256,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [heightAnimate, musicRatings]);

  return (
    <View className="mx-2 md:mx-4 pb-2">
      <CustomText>{entryTypeMeanings[musicEntryType!]}</CustomText>
      <CustomText className="text-lg font-semibold mb-1">
        {prettyDate(formatDate(musicDate!), false)}
      </CustomText>
      <Animated.View
        style={{
          height: heightAnimate,
          marginVertical: 4,
        }}
      >
        <FlashList
          data={musicRatings}
          ListFooterComponent={
            <Button
              onPress={() => {
                closeModal();
                openSelectSongModal();
              }}
              className="mt-2"
              disabled={musicRatings.length === 10}
            >
              <View className="items-center flex-row gap-2">
                <AntDesign name="plus" size={32} color="white" />
                <CustomText className="text-white">
                  {musicRatings.length > 0
                    ? "Weiteres Lied"
                    : "Lied hinzufügen"}
                </CustomText>
              </View>
            </Button>
          }
          renderItem={({ item, index }) => {
            return (
              <View
                className={`border-b-2 p-1 border-seas-gray ${
                  index === 0 ? "border-t-2" : ""
                } ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                <View className="flex-row gap-2">
                  <View className="w-4/5">
                    <CustomText className="text-lg leading-[18px]">
                      {item.title} ({item.number})
                    </CustomText>
                    <CustomText className="text-xs">
                      {item.book.name}
                    </CustomText>
                    {item.comment && (
                      <CustomText className="text-base mt-1">
                        {item.comment}
                      </CustomText>
                    )}
                  </View>
                  <View className="w-1/5 flex-1 items-center justify-center">
                    <TouchableOpacity
                      onPress={() => {
                        setMusicRatings((ratings) =>
                          ratings.filter((_rating, idx) => idx !== index),
                        );
                      }}
                    >
                      <AntDesign name="close" size={32} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Ratings size="small" initialValue={item.rating} frozen />
              </View>
            );
          }}
        />
      </Animated.View>
      <Button
        onPress={async () => {
          await saveSongs(musicRatings, musicDate!, musicEntryType!);
          setMusicRatings([]);
          setMusicEntryType(undefined);
          setMusicDate(undefined);
          closeModal();
        }}
        className="mt-4"
        disabled={musicRatings.length === 0}
      >
        Fertig
      </Button>
    </View>
  );
}
