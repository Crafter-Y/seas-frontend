import { Text, View } from "react-native";
import React, { useEffect } from "react";
import tw from "@/tailwind";
import useDeletePage from "@/hooks/api/useDeletePage";
import Button from "../elements/Button";
import { Color } from "@/helpers/Constants";

type Props = {
  selectedPage?: APIResponsePage;
  closeModal?: () => void;
  queryPages: () => void;
};

export default function DeletePageModal({
  selectedPage,
  closeModal,
  queryPages,
}: Props) {
  const { deletePage, succesfulDeletion } = useDeletePage();

  useEffect(() => {
    if (succesfulDeletion) {
      queryPages();
      closeModal?.();
    }
  }, [succesfulDeletion]);

  return (
    <>
      <Text style={tw`mx-4`}>
        Soll der Plan{" "}
        <Text style={tw`font-semibold`}>{selectedPage?.name}</Text> wirklich
        glöscht werden?
      </Text>
      <Text style={tw`text-red-400 mx-4 mt-2`}>
        Dadurch werden alle Eintragungen von Mitgliedern auf diesem Plan
        unwiderruflich gelöscht!
      </Text>
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
