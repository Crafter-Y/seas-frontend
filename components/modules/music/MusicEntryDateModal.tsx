import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import tw from "@/tailwind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

type Props = {
  closeModal?: () => void;
  openMusicEntryTypeModal?: () => void;
  openMusicSelectonModal?: () => void;
};

export default function MusicEntryDateModal({
  closeModal,
  openMusicEntryTypeModal,
  openMusicSelectonModal,
}: Props) {
  const [isPickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    Store.update((state) => {
      state.musicDate = undefined;
    });
    setPickerOpen(true);
  }, []);

  const musicDate = Store.useState((state) => state.musicDate);

  return (
    <View style={tw`mx-2 md:mx-4`}>
      <CustomText>Datum auswählen:</CustomText>

      <CustomText style={tw`text-lg font-semibold`}>
        {musicDate
          ? `Ausgewähltes Datum: ${prettyDate(formatDate(musicDate), false)}`
          : "Kein Datum ausgewählt"}
      </CustomText>

      <Button
        onPress={() => {
          setPickerOpen(true);
        }}
      >
        {musicDate ? "Neues Datum auswählen" : "Datum auswählen"}
      </Button>

      <View style={tw`mb-2 mt-3 flex-row gap-2`}>
        <Button
          onPress={() => {
            closeModal?.();
            openMusicEntryTypeModal?.();
          }}
          style={tw`flex-1`}
        >
          Zurück
        </Button>
        <Button
          onPress={() => {
            closeModal?.();
            openMusicSelectonModal?.();
          }}
          style={tw`flex-1`}
          disabled={!musicDate}
        >
          Weiter
        </Button>
      </View>

      <DatePickerModal
        locale="de"
        mode="single"
        visible={isPickerOpen}
        onDismiss={() => {
          Store.update((state) => {
            state.musicDate = undefined;
          });
          setPickerOpen(false);
        }}
        onConfirm={(date) => {
          Store.update((state) => {
            state.musicDate = date.date;
          });
          setPickerOpen(false);
        }}
      />
    </View>
  );
}
