import tw from "@/tailwind";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Button from "@/components/elements/Button";
import { Store } from "@/helpers/store";

type Props = {
  closeModal?: () => void;
  openMusicActionModal?: () => void;
  openEntryDateModal?: () => void;
};

export const entryTypeMeanings = {
  MISSION: "Gottesdienst",
  TEST: "Probe",
} as const;

export type MusicEntryType = keyof typeof entryTypeMeanings;

export default function MusicEntryTypeModal({
  closeModal,
  openMusicActionModal,
  openEntryDateModal,
}: Props) {
  return (
    <View style={tw`mx-2 md:mx-4`}>
      <Text>Typ des Datensatzes:</Text>
      <TouchableOpacity
        style={tw`flex-row justify-between border-2 border-gray-400 rounded-lg px-4 py-2 mt-1 ${
          Platform.OS == "web" ? "shadow-md" : ""
        }`}
        onPress={() => {
          Store.update((state) => {
            state.musicEntryType = "MISSION";
          });

          closeModal?.();
          openEntryDateModal?.();
        }}
      >
        <Text style={tw`text-xl font-semibold`}>
          {entryTypeMeanings["MISSION"]}
        </Text>
        <AntDesign name="star" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw` border-2 border-gray-400 rounded-lg px-4 py-2 mt-1 mb-3 ${
          Platform.OS == "web" ? "shadow-md" : ""
        }`}
        onPress={() => {
          Store.update((state) => {
            state.musicEntryType = "TEST";
          });
          closeModal?.();
          openEntryDateModal?.();
        }}
      >
        <Text style={tw`text-xl font-semibold`}>
          {entryTypeMeanings["TEST"]}
        </Text>
      </TouchableOpacity>
      <Button
        style={tw`mb-2`}
        onPress={() => {
          closeModal?.();
          openMusicActionModal?.();
        }}
      >
        Zurück
      </Button>
    </View>
  );
}
