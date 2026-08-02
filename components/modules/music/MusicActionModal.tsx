import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import { Store } from "@/helpers/store";

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
    },
  );

  return (
    <>
      <View className="flex-row m-3 md:m-4 gap-3">
        <TouchableOpacity
          className={`flex-grow flex-1 rounded-lg border-gray-400 border-2 gap-4 justify-between p-2 ${
            Platform.OS === "web" ? "shadow-md" : ""
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
          <CustomText className="text-center text-xl font-semibold">
            Daten eingeben
          </CustomText>
          <AntDesign
            name="plus"
            size={64}
            color="gray"
            className="w-16 mx-auto"
          />
        </TouchableOpacity>
        <TouchableOpacity
          // wriedly, in ios, the icons clip out the bottom
          className={`flex-grow flex-1 rounded-lg border-gray-400 border-2 gap-4 justify-between px-2 pt-2 ${
            Platform.OS === "web" ? "shadow-md" : ""
          } ${Platform.OS === "ios" ? "pb-10" : "pb-2"}`}
          onPress={() => {
            closeModal();
            openHistoryModal();
          }}
        >
          <CustomText className="text-center text-xl font-semibold">
            Informationen abrufen
          </CustomText>
          <AntDesign
            name="paper-clip"
            size={64}
            color="gray"
            className="w-16 mx-auto"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
