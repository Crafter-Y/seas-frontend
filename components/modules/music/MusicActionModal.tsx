import tw from "@/tailwind";
import { Platform, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Store } from "@/helpers/store";
import React from "react";
import CustomText from "@/components/elements/CustomText";

type Props = {
  closeModal: () => void;
  openEntryTypeModal: () => void;
  openOverviewModal: () => void;
  openHistoryModal: () => void;
};

export default function MusicActionModal({
  closeModal,
  openEntryTypeModal,
  openOverviewModal,
  openHistoryModal,
}: Props) {
  const { musicRatings, musicEntryType, musicDate } = Store.useState(
    (state) => {
      return {
        musicRatings: state.musicRatings,
        musicEntryType: state.musicEntryType,
        musicDate: state.musicDate,
      };
    }
  );

  return (
    <>
      <View style={tw`flex-row m-3 md:m-4 gap-3`}>
        <TouchableOpacity
          style={tw`flex-grow flex-1 rounded-lg border-gray-400 border-2 gap-4 justify-between p-2 ${
            Platform.OS == "web" ? "shadow-md" : ""
          }`}
          onPress={() => {
            closeModal();

            if (musicRatings.length !== 0 && musicEntryType && musicDate) {
              openOverviewModal();
            } else {
              openEntryTypeModal();
            }
          }}
        >
          <CustomText style={tw`text-center text-xl font-semibold`}>
            Daten eingeben
          </CustomText>
          <AntDesign
            name="plus"
            size={64}
            color="gray"
            style={tw`w-16 mx-auto`}
          />
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
          onPress={() => {
            closeModal();
            openHistoryModal();
          }}
        >
          <CustomText style={tw`text-center text-xl font-semibold`}>
            Informationen abrufen
          </CustomText>
          <AntDesign
            name="paperclip"
            size={64}
            color="gray"
            style={tw`w-16 mx-auto`}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
