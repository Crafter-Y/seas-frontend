import tw from "@/tailwind";
import { View } from "react-native";
import Button from "../elements/Button";
import { Color } from "@/helpers/Constants";
import useDeleteEvent from "@/hooks/api/useDeleteEvent";
import { useEffect } from "react";
import { Store } from "@/helpers/store";
import { prettyDate } from "@/helpers/format";
import CustomText from "../elements/CustomText";
import React from "react";

type Props = {
  closeModal: () => void;
  openRowModal: () => void;
  selectedRow?: BoardRow;
  triggerBoardRefetch: () => void;
};

export default function BoardRowDeleteModal({
  closeModal,
  openRowModal,
  selectedRow,
  triggerBoardRefetch,
}: Props) {
  const { deleteEvent, succesfulDeletion } = useDeleteEvent();

  useEffect(() => {
    if (succesfulDeletion) {
      // TODO: figure out, if this call is even nessesary
      Store.update((state) => {
        state.selectedRow = undefined;
      });
      triggerBoardRefetch();
      closeModal();
    }
  }, [succesfulDeletion]);

  return (
    <>
      <CustomText style={tw`mx-4`}>
        Soll der Termin{" "}
        <CustomText style={tw`font-semibold`}>
          {selectedRow ? prettyDate(selectedRow.date, false) : ""}
        </CustomText>{" "}
        wirklich glöscht werden?
      </CustomText>
      <CustomText style={tw`text-red-400 mx-4 mt-2`}>
        Dadurch werden <CustomText style={tw`font-semibold`}>alle</CustomText>{" "}
        Eintragungen von Mitgliedern, sowie die Kommentare gelöscht. Dies kann
        nicht mehr Rückgängig gemacht werden!
      </CustomText>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button
          onPress={() => {
            deleteEvent(selectedRow!.date);
          }}
          color={Color.RED}
        >
          Löschen
        </Button>
        <Button
          onPress={() => {
            closeModal();
            openRowModal();
          }}
        >
          Abbrechen
        </Button>
      </View>
    </>
  );
}
