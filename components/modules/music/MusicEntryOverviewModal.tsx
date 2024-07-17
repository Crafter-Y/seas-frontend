import { Color } from "@/helpers/Constants";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import tw from "@/tailwind";
import { FlashList } from "@shopify/flash-list";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import Button from "@/components/elements/Button";
import Ratings from "@/components/elements/Ratings";
import { entryTypeMeanings } from "./MusicEntryTypeModal";
import useSaveSongEntries from "@/hooks/api/useSaveSongEntries";

type Props = {
  closeModal?: () => void;
  openSelectSongModal?: () => void;
};

export default function MusicEntryOverviewModal({
  closeModal,
  openSelectSongModal,
}: Props) {
  const { saveSongs } = useSaveSongEntries();

  const { musicDate, musicRatings, musicEntryType } = Store.useState(
    (state) => {
      return {
        musicDate: state.musicDate,
        musicRatings: state.musicRatings,
        musicEntryType: state.musicEntryType,
      };
    }
  );

  const heightAnimate = useRef(new Animated.Value(128)).current;

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
  }, [musicRatings]);

  return (
    <View style={tw`mx-2 md:mx-4 pb-2`}>
      <Text>{entryTypeMeanings[musicEntryType!]}</Text>
      <Text style={tw`text-lg font-semibold mb-1`}>
        {prettyDate(formatDate(musicDate!), false)}
      </Text>
      <Animated.View
        style={{
          height: heightAnimate,
          marginVertical: 4,
        }}
      >
        <FlashList
          estimatedItemSize={5}
          data={musicRatings}
          ListFooterComponent={
            <Button
              onPress={() => {
                closeModal?.();
                openSelectSongModal?.();
              }}
              style={tw`mt-2`}
              disabled={musicRatings.length == 10}
            >
              <View style={tw`items-center flex-row gap-2`}>
                <AntDesign name="plus" size={32} color="white" />
                <Text style={tw`text-white`}>
                  {musicRatings.length > 0
                    ? "Weiteres Lied"
                    : "Lied hinzufügen"}
                </Text>
              </View>
            </Button>
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={tw`border-b-2 p-1 border-[${Color.GRAY}] ${
                  index == 0 ? "border-t-2" : ""
                } ${index % 2 == 0 ? "bg-gray-100" : ""}`}
              >
                <View style={tw`flex-row gap-2`}>
                  <View style={tw`w-4/5`}>
                    <Text style={tw`text-lg leading-[18px]`}>
                      {item.title} ({item.number})
                    </Text>
                    <Text style={tw`text-xs`}>{item.book.name}</Text>
                    {item.comment && (
                      <Text style={tw`text-base mt-1`}>{item.comment}</Text>
                    )}
                  </View>
                  <View style={tw`w-1/5 flex-1 items-center justify-center`}>
                    <TouchableOpacity
                      onPress={() => {
                        Store.update((state) => {
                          state.musicRatings = musicRatings
                            .map((el, idx) => (idx === index ? undefined : el))
                            .filter((el) => el !== undefined);
                        });
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
          await saveSongs(musicRatings, musicDate!);

          Store.update((state) => {
            state.musicRatings = [];
            state.musicEntryType = undefined;
            state.musicDate = undefined;
          });
          closeModal?.();
        }}
        style={tw`mt-4`}
        disabled={musicRatings.length == 0}
      >
        Fertig
      </Button>
    </View>
  );
}
