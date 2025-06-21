import React, { useEffect } from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import { formatEvent } from "@/helpers/format";
import { DisplayableRecurringEvent } from "@/hooks/api/useAllRecurringEvents";
import useDeleteRecurringEvent from "@/hooks/api/useDeleteRecurringEvent";

type Props = {
  closeModal: () => void;
  selectedEvent?: DisplayableRecurringEvent;
  queryRecurringEvents: () => void;
};

export default function DeleteEventModal({
  closeModal,
  selectedEvent,
  queryRecurringEvents,
}: Props) {
  const { deleteRecurringEvent, successfulDelete } = useDeleteRecurringEvent();

  useEffect(() => {
    if (successfulDelete) {
      setTimeout(() => {
        queryRecurringEvents();
        closeModal();
      }, 200);
    }
  }, [closeModal, queryRecurringEvents, successfulDelete]);

  return (
    <>
      <CustomText className="mx-4">
        Soll der Termin{" "}
        <CustomText className="font-semibold">
          {formatEvent(
            selectedEvent!.eventType,
            selectedEvent!.dayOfWeek || 0,
            selectedEvent!.dayOfMonth || 0,
            selectedEvent!.eventMonth || 0,
          )}
        </CustomText>{" "}
        wirklich glöscht werden?
      </CustomText>
      <CustomText className="text-red-400 mx-4 mt-2">
        Dadurch werden alle Eintragungen von Mitgliedern zu{" "}
        <CustomText className="font-semibold">allen</CustomText> zugehörigen
        Terminen gelöscht. Dies kann nicht mehr Rückgängig gemacht werden!
      </CustomText>
      <View className="justify-center flex-row gap-2 my-4">
        <Button
          onPress={() => {
            deleteRecurringEvent(selectedEvent!.id, selectedEvent!.eventType);
          }}
          color={Color.RED}
        >
          Löschen
        </Button>
        <Button onPress={() => closeModal()}>Abbrechen</Button>
      </View>
    </>
  );
}
