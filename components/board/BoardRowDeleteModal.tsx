import React, { use, useEffect } from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { AppContext } from "@/helpers/appContext";
import { Color } from "@/helpers/Constants";
import { prettyDate } from "@/helpers/format";
import useDeleteEvent from "@/hooks/api/useDeleteEvent";

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
  const { setSelectedRow } = use(AppContext);

  useEffect(() => {
    if (succesfulDeletion) {
      // TODO: figure out, why selectedRow gets set to undefined here:
      setSelectedRow(undefined);
      triggerBoardRefetch();
      closeModal();
    }
    // TODO: including triggerBoardRefetch and closeModal causes this to invoke multiple times, probably because of parent rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [succesfulDeletion]);

  return (
    <>
      <CustomText className="mx-4">
        Soll der Termin{" "}
        <CustomText className="font-semibold">
          {selectedRow ? prettyDate(selectedRow.date, false) : ""}
        </CustomText>{" "}
        wirklich glöscht werden?
      </CustomText>
      <CustomText className="text-red-400 mx-4 mt-2">
        Dadurch werden <CustomText className="font-semibold">alle</CustomText>{" "}
        Eintragungen von Mitgliedern, sowie die Kommentare gelöscht. Dies kann
        nicht mehr Rückgängig gemacht werden!
      </CustomText>
      <View className="justify-center flex-row gap-2 my-4">
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
