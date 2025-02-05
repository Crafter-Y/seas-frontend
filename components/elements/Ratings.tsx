import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ClassInput } from "twrnc/dist/esm/types";

import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";

type Props = {
  onRatingChange?: (rating: Rating) => void;
  style?: ClassInput;
  size: RatingsSize;
  initialValue?: Rating;
  frozen?: boolean;
};

type RatingsSize = "large" | "small";

export const ratingMeaning = {
  "1": "Weiteres Üben erforderlich",
  "2": "Hat Verbesserungspotenzial",
  "3": "okay",
  "4": "gut",
  "5": "Sehr gut",
} as const;

export type Rating = keyof typeof ratingMeaning;

type RatingButtonProps = {
  rating?: Rating;
  setRating: (rating: Rating) => void;
  ratingValue: Rating;
  activationValues: (Rating | "")[];
  size: RatingsSize;
  frozen: boolean;
};

const RatingButton = ({
  rating,
  setRating,
  ratingValue,
  activationValues,
  size,
  frozen,
}: RatingButtonProps) => {
  return (
    <TouchableOpacity onPress={() => setRating(ratingValue)} disabled={frozen}>
      <AntDesign
        name={activationValues.includes(rating ?? "") ? "star" : "staro"}
        size={size === "large" ? 48 : 24}
        color={Color.GREEN}
      />
    </TouchableOpacity>
  );
};

export default function Ratings({
  onRatingChange,
  style,
  size,
  initialValue,
  frozen = false,
}: Props) {
  const [rating, setRating] = useState<Rating | undefined>(initialValue);

  useEffect(() => {
    if (rating !== undefined) onRatingChange?.(rating);
  }, [onRatingChange, rating]);

  return (
    <View style={tw.style("flex-row", style)}>
      <RatingButton
        rating={rating}
        setRating={setRating}
        ratingValue="1"
        activationValues={["1", "2", "3", "4", "5"]}
        size={size}
        frozen={frozen}
      />
      <RatingButton
        rating={rating}
        setRating={setRating}
        ratingValue="2"
        activationValues={["2", "3", "4", "5"]}
        size={size}
        frozen={frozen}
      />
      <RatingButton
        rating={rating}
        setRating={setRating}
        ratingValue="3"
        activationValues={["3", "4", "5"]}
        size={size}
        frozen={frozen}
      />
      <RatingButton
        rating={rating}
        setRating={setRating}
        ratingValue="4"
        activationValues={["4", "5"]}
        size={size}
        frozen={frozen}
      />
      <RatingButton
        rating={rating}
        setRating={setRating}
        ratingValue="5"
        activationValues={["5"]}
        size={size}
        frozen={frozen}
      />
    </View>
  );
}
