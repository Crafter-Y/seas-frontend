import { Color } from "@/helpers/Constants";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import tw from "@/tailwind";
import { Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import Button from "@/components/elements/Button";

type Props = {
  closeModal?: () => void;
  openSelectSongModal?: () => void;
};

type RatingButtonProps = {
  rating?: Rating;
  setRating: (rating: Rating) => void;
  ratingValue: Rating;
  activationValues: (Rating | "")[];
};

const ratingMeaning = {
  "1": "Weiteres Üben erforderlich",
  "2": "Hat Verbesserungspotenzial",
  "3": "okay",
  "4": "gut",
  "5": "Sehr gut",
} as const;

type Rating = keyof typeof ratingMeaning;

const RatingButton = ({
  rating,
  setRating,
  ratingValue,
  activationValues,
}: RatingButtonProps) => {
  return (
    <TouchableOpacity onPress={() => setRating(ratingValue)}>
      <AntDesign
        name={activationValues.includes(rating ?? "") ? "star" : "staro"}
        size={48}
        color={Color.GREEN}
      />
    </TouchableOpacity>
  );
};

export default function MusicEntryRatingModal({
  closeModal,
  openSelectSongModal,
}: Props) {
  const { musicDate, song } = Store.useState((state) => {
    return {
      musicDate: state.musicDate,
      song: state.musicSongSelected,
    };
  });

  const [rating, setRating] = useState<Rating | undefined>();

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
            {song?.title} ({song?.id})
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

      <Text style={tw`mt-3 text-xl font-semibold`}>
        Bewertung für dieses Lied abgeben:
      </Text>
      <Text style={tw`text-center text-lg mt-2`}>
        {rating ? ratingMeaning[rating] : ""}
      </Text>
      <View style={tw`flex-row gap-2 justify-center mt-1`}>
        <RatingButton
          rating={rating}
          setRating={setRating}
          ratingValue="1"
          activationValues={["1", "2", "3", "4", "5"]}
        />
        <RatingButton
          rating={rating}
          setRating={setRating}
          ratingValue="2"
          activationValues={["2", "3", "4", "5"]}
        />
        <RatingButton
          rating={rating}
          setRating={setRating}
          ratingValue="3"
          activationValues={["3", "4", "5"]}
        />
        <RatingButton
          rating={rating}
          setRating={setRating}
          ratingValue="4"
          activationValues={["4", "5"]}
        />
        <RatingButton
          rating={rating}
          setRating={setRating}
          ratingValue="5"
          activationValues={["5"]}
        />
      </View>
      <Button
        onPress={() => {
          closeModal?.();
        }}
        style={tw`mt-4`}
        disabled={!rating}
      >
        Weiter
      </Button>
    </View>
  );
}
