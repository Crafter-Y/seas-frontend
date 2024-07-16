import tw from "@/tailwind";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  closeModal?: () => void;
  openEntryTypeModal?: () => void;
};

export default function MusicActionModal({
  closeModal,
  openEntryTypeModal,
}: Props) {
  return (
    <>
      <View style={tw`flex-row m-3 md:m-4 gap-3`}>
        <TouchableOpacity
          style={tw`flex-grow flex-1 rounded-lg border-gray-400 border-2 gap-4 justify-between p-2 ${
            Platform.OS == "web" ? "shadow-md" : ""
          }`}
          onPress={() => {
            closeModal?.();
            openEntryTypeModal?.();
          }}
        >
          <Text style={tw`text-center text-xl font-semibold`}>
            Daten eingeben
          </Text>
          <AntDesign name="plus" size={64} color="gray" style={tw`mx-auto`} />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw.style(
            {
              "shadow-md": Platform.OS == "web",
              "pb-10": Platform.OS == "ios", // wriedly, in ios, the icons clip out the bottom
              "pb-2": Platform.OS != "ios",
            },
            "flex-grow flex-1 rounded-lg border-gray-400 border-2 gap-4 justify-between px-2 pt-2"
          )}
        >
          <Text style={tw`text-center text-xl font-semibold`}>
            Informationen abrufen
          </Text>
          <AntDesign
            name="paperclip"
            size={64}
            color="gray"
            style={tw`mx-auto`}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
