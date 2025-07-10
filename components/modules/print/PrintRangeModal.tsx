import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Color } from "@/helpers/Constants";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import tw from "@/tailwind";

type Props = {
  closeModal: () => void;
  openColumnsModal: () => void;
};

export default function PrintRangeModal({
  closeModal,
  openColumnsModal,
}: Props) {
  const fromDate = Store.useState((state) => state.lastQueryFrom);
  const toDate = Store.useState((state) => state.lastQueryTo);

  const [pickerError, setPickerError] = useState("");

  const [pickerRange, setPickerRange] = useState<{
    startDate: CalendarDate;
    endDate: CalendarDate;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const [isPickerOpen, setPickerOpen] = useState(false);

  const [selectedRadio, setSelectedRadio] = useState<"first" | "second">(
    "first",
  );

  const onConfirm = ({
    startDate,
    endDate,
  }: {
    startDate: CalendarDate;
    endDate: CalendarDate;
  }) => {
    setPickerOpen(false);
    setPickerRange({ startDate, endDate });
  };

  return (
    <>
      <View style={tw`px-4`}>
        <Pressable
          style={tw`flex-row items-center`}
          onPress={() => setSelectedRadio("first")}
        >
          <RadioButton.Android
            value="first"
            status={selectedRadio === "first" ? "checked" : "unchecked"}
            onPress={() => {
              setSelectedRadio("first");
            }}
            color={Color.BLUE}
          />
          <CustomText>Aktueller Plan:</CustomText>
        </Pressable>
        <CustomText>
          {prettyDate(formatDate(fromDate!), false) +
            " - " +
            prettyDate(formatDate(toDate!), false)}
        </CustomText>

        <Pressable
          style={tw`flex-row items-center mt-2`}
          onPress={() => setSelectedRadio("second")}
        >
          <RadioButton.Android
            value="first"
            status={selectedRadio === "second" ? "checked" : "unchecked"}
            onPress={() => {
              setSelectedRadio("second");
            }}
            color={Color.BLUE}
          />
          <CustomText>Fester Zeitraum:</CustomText>
        </Pressable>
        {pickerRange.startDate && pickerRange.endDate && (
          <CustomText>
            {prettyDate(formatDate(pickerRange.startDate!), false) +
              " - " +
              prettyDate(formatDate(pickerRange.endDate!), false)}
          </CustomText>
        )}
        <View style={tw`flex-row`}>
          <Button
            onPress={() => {
              setPickerOpen(true);
              setSelectedRadio("second");
            }}
          >
            Zeitraum auswählen
          </Button>
        </View>
        <DatePickerModal
          locale="de"
          mode="range"
          visible={isPickerOpen}
          onDismiss={() => setPickerOpen(false)}
          startDate={pickerRange.startDate}
          endDate={pickerRange.endDate}
          onConfirm={onConfirm}
        />

        <ErrorDisplay error={pickerError} hasError={!!pickerError} />
      </View>

      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal} color={Color.RED}>
          Abbrechen
        </Button>
        <Button
          onPress={() => {
            if (selectedRadio === "first") {
              Store.update((state) => {
                state.printDateStart = fromDate;
                state.printDateEnd = toDate;
              });
            } else if (selectedRadio === "second") {
              if (!pickerRange.startDate || !pickerRange.endDate) {
                setPickerError("Der Zeitraum muss komplett angegeben werden!");
                return;
              }
              Store.update((state) => {
                state.printDateStart = pickerRange.startDate!;
                state.printDateEnd = pickerRange.endDate!;
              });
            }
            closeModal();
            openColumnsModal();
          }}
          color={Color.BLUE}
        >
          Weiter
        </Button>
      </View>
    </>
  );
}
