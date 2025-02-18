import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, ViewProps } from "react-native";

import { Color } from "@/helpers/Constants";

type Props = {
  onRatingChange?: (rating: Rating) => void;
  size: RatingsSize;
  initialValue?: Rating;
  frozen?: boolean;
} & ViewProps;

type RatingsSize = "large" | "small";

// TODO: i18n translate meanings
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
  size,
  initialValue,
  frozen = false,
  className,
  ...props
}: Props) {
  const [rating, setRating] = useState<Rating | undefined>(initialValue);

  useEffect(() => {
    if (rating !== undefined) onRatingChange?.(rating);
  }, [onRatingChange, rating]);

  return (
    <View className={`flex-row ${className}`} {...props}>
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
