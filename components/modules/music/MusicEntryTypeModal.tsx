import { AntDesign } from "@expo/vector-icons";
import { use } from "react";
import { Platform, TouchableOpacity, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { AppContext } from "@/helpers/appContext";

type Props = {
  closeModal: () => void;
  openMusicActionModal: () => void;
  openEntryDateModal: () => void;
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
  const { setMusicEntryType } = use(AppContext);

  return (
    <View className="mx-2 md:mx-4">
      <CustomText>Typ des Datensatzes:</CustomText>
      <TouchableOpacity
        className={`flex-row justify-between border-2 border-gray-400 rounded-lg px-4 py-2 mt-1 ${
          Platform.OS === "web" ? "shadow-md" : ""
        }`}
        onPress={() => {
          setMusicEntryType("MISSION");

          closeModal();
          openEntryDateModal();
        }}
      >
        <CustomText className="text-xl font-semibold">
          {entryTypeMeanings["MISSION"]}
        </CustomText>
        <AntDesign name="star" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity
        className={` border-2 border-gray-400 rounded-lg px-4 py-2 mt-1 mb-3 ${
          Platform.OS === "web" ? "shadow-md" : ""
        }`}
        onPress={() => {
          setMusicEntryType("TEST");
          closeModal();
          openEntryDateModal();
        }}
      >
        <CustomText className="text-xl font-semibold">
          {entryTypeMeanings["TEST"]}
        </CustomText>
      </TouchableOpacity>
      <Button
        className="mb-2"
        onPress={() => {
          closeModal();
          openMusicActionModal();
        }}
      >
        Zurück
      </Button>
    </View>
  );
}
