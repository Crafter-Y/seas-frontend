import React, { useEffect } from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import useDeletePage from "@/hooks/api/useDeletePage";
import tw from "@/tailwind";

type Props = {
  selectedPage?: APIResponsePage;
  closeModal: () => void;
  queryPages: () => void;
};

export default function DeletePageModal({
  selectedPage,
  closeModal,
  queryPages,
}: Props) {
  const { deletePage, succesfulDeletion } = useDeletePage();

  useEffect(() => {
    // TODO: gets called twice (probably because of redefinitions of closeModal and queryPages by parent element)
    if (succesfulDeletion) {
      queryPages();
      closeModal();
    }
  }, [closeModal, queryPages, succesfulDeletion]);

  return (
    <>
      <CustomText style={tw`mx-4`}>
        Soll der Plan{" "}
        <CustomText style={tw`font-semibold`}>{selectedPage?.name}</CustomText>{" "}
        wirklich glöscht werden?
      </CustomText>
      <CustomText style={tw`text-red-400 mx-4 mt-2`}>
        Dadurch werden alle Eintragungen von Mitgliedern auf diesem Plan
        unwiderruflich gelöscht!
      </CustomText>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button
          onPress={() => {
            deletePage(selectedPage!.id);
          }}
          color={Color.RED}
        >
          Löschen
        </Button>
        <Button onPress={closeModal}>Abbrechen</Button>
      </View>
    </>
  );
}
