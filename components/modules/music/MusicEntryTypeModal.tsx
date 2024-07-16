import tw from "@/tailwind";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Button from "@/components/elements/Button";

type Props = {
  closeModal?: () => void;
  openMusicActionModal?: () => void;
  openEntryDateModal?: () => void;
};

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
          closeModal?.();
          openEntryDateModal?.();
        }}
      >
        <Text style={tw`text-xl font-semibold`}>Gottesdienst</Text>
        <AntDesign name="star" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw` border-2 border-gray-400 rounded-lg px-4 py-2 mt-1 mb-3 ${
          Platform.OS == "web" ? "shadow-md" : ""
        }`}
        onPress={() => {
          closeModal?.();
          openEntryDateModal?.();
        }}
      >
        <Text style={tw`text-xl font-semibold`}>Probe</Text>
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
