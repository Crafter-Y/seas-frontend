import { Color } from "@/helpers/Constants";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import tw from "@/tailwind";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import Button from "@/components/elements/Button";
import Ratings, { Rating, ratingMeaning } from "@/components/elements/Ratings";

type Props = {
  closeModal?: () => void;
  openSelectSongModal?: () => void;
  openOverviewModal?: () => void;
};

export default function MusicEntryRatingModal({
  closeModal,
  openSelectSongModal,
  openOverviewModal,
}: Props) {
  const { musicDate, song } = Store.useState((state) => {
    return {
      musicDate: state.musicDate,
      song: state.musicSongSelected,
    };
  });

  const [rating, setRating] = useState<Rating | undefined>();
  const [comment, setComment] = useState("");

  return (
    <View style={tw`mx-2 md:mx-4 pb-2`}>
      <Text style={tw`text-lg font-semibold mb-1`}>
        {prettyDate(formatDate(musicDate!), false)}
      </Text>
      <View
        style={tw`border-2 p-1 flex-row gap-2 border-[${Color.GRAY}] rounded-lg justify-between`}
      >
        <View>
          <Text style={tw`text-lg leading-[18px]`}>
            {song?.title} ({song?.number})
          </Text>
          <Text style={tw`text-xs`}>{song?.book.name}</Text>
        </View>
        <View style={tw`items-center justify-center`}>
          <TouchableOpacity
            onPress={() => {
              closeModal?.();
              openSelectSongModal?.();
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
        style={tw`border-2 rounded-lg border-[${Color.GRAY}] px-2 py-1 opacity-85 text-lg mt-2`}
        placeholder="Kommentar eingeben"
        value={comment}
        onChangeText={setComment}
      />

      <Text style={tw`mt-3 text-xl font-semibold`}>
        Bewertung für dieses Lied abgeben:
      </Text>
      <Text style={tw`text-center text-lg mt-2`}>
        {rating ? ratingMeaning[rating] : ""}
      </Text>

      <Ratings
        onRatingChange={setRating}
        style={tw`gap-2 justify-center mt-1`}
        size="large"
      />

      <Button
        onPress={() => {
          closeModal?.();
          Store.update((state) => {
            state.musicRatings.push({
              ...song!,
              rating: rating!,
              comment: comment.trim() == "" ? undefined : comment,
            });
          });
          openOverviewModal?.();
        }}
        style={tw`mt-4`}
        disabled={!rating}
      >
        Weiter
      </Button>
    </View>
  );
}
