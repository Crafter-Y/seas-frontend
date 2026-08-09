import { AntDesign } from "@expo/vector-icons";
import { use, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Ratings, { Rating, ratingMeaning } from "@/components/elements/Ratings";
import { AppContext } from "@/helpers/appContext";
import { formatDate, prettyDate } from "@/helpers/format";

type Props = {
  closeModal: () => void;
  openSelectSongModal: () => void;
  openOverviewModal: () => void;
};

export default function MusicEntryRatingModal({
  closeModal,
  openSelectSongModal,
  openOverviewModal,
}: Props) {
  const {
    musicDate,
    musicSongSelected: song,
    setMusicRatings,
  } = use(AppContext);

  const [rating, setRating] = useState<Rating | undefined>();
  const [comment, setComment] = useState("");

  return (
    <View className="mx-2 md:mx-4 pb-2">
      <CustomText className="text-lg font-semibold mb-1">
        {prettyDate(formatDate(musicDate!), false)}
      </CustomText>
      <View className="border-2 p-1 flex-row gap-2 border-seas-gray rounded-lg justify-between">
        <View>
          <CustomText className="text-lg leading-[18px]">
            {song?.title} ({song?.number})
          </CustomText>
          <CustomText className="text-xs">{song?.book.name}</CustomText>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity
            onPress={() => {
              closeModal();
              openSelectSongModal();
            }}
          >
            <AntDesign name="edit" size={32} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        multiline
        editable
        numberOfLines={2}
        className="border-2 rounded-lg border-seas-gray px-2 py-1 opacity-85 text-lg mt-2"
        placeholder="Kommentar eingeben"
        value={comment}
        onChangeText={setComment}
      />

      <CustomText className="mt-3 text-xl font-semibold">
        Bewertung für dieses Lied abgeben:
      </CustomText>
      <CustomText className="text-center text-lg mt-2">
        {rating ? ratingMeaning[rating] : ""}
      </CustomText>

      <Ratings
        onRatingChange={setRating}
        className="gap-2 justify-center mt-1"
        size="large"
      />

      <Button
        onPress={() => {
          closeModal();
          setMusicRatings((ratings) => [
            ...ratings,
            {
              ...song!,
              rating: rating!,
              comment: comment.trim() === "" ? undefined : comment,
            },
          ]);
          openOverviewModal();
        }}
        className="mt-4"
        disabled={!rating}
      >
        Weiter
      </Button>
    </View>
  );
}
