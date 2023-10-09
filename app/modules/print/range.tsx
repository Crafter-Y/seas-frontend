import CenterModal from "@/components/elements/CenterModal";
import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";
import { Pressable, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { Store } from "@/helpers/store";
import { prettyDate } from "@/helpers/format";
import { formatDate } from "@/helpers/format";
import { useState } from "react";
import { DatePickerModal } from "react-native-paper-dates";
import Button from "@/components/elements/Button";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { router } from "expo-router";
import ErrorDisplay from "@/components/ErrorDisplay";

const SelectPrintRange = () => {
  const fromDate = Store.useState((state) => state.lastQueryFrom);
  const toDate = Store.useState((state) => state.lastQueryTo);

  const [error, setError] = useState("");

  const [range, setRange] = useState<{
    startDate: CalendarDate;
    endDate: CalendarDate;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const [open, setOpen] = useState(false);

  const [selectedRadio, setSelectedRadio] = useState<"first" | "second">(
    "first"
  );

  const onConfirm = ({
    startDate,
    endDate,
  }: {
    startDate: CalendarDate;
    endDate: CalendarDate;
  }) => {
    setOpen(false);
    setRange({ startDate, endDate });
  };

  return (
    <CenterModal>
      <Text style={tw`text-center text-2xl underline my-2 font-semibold`}>
        Drucken - Zeitraum auswählen
      </Text>
      <View style={tw`px-4`}>
        <Pressable
          style={tw`flex-row items-center`}
          onPress={() => setSelectedRadio("first")}
        >
          <RadioButton
            value="first"
            status={selectedRadio == "first" ? "checked" : "unchecked"}
            onPress={() => {
              setSelectedRadio("first");
            }}
            color={Color.BLUE}
          />
          <Text>Aktueller Plan:</Text>
        </Pressable>
        <Text>
          {prettyDate(formatDate(fromDate!), false) +
            " - " +
            prettyDate(formatDate(toDate!), false)}
        </Text>

        <Pressable
          style={tw`flex-row items-center mt-2`}
          onPress={() => setSelectedRadio("second")}
        >
          <RadioButton
            value="first"
            status={selectedRadio == "second" ? "checked" : "unchecked"}
            onPress={() => {
              setSelectedRadio("second");
            }}
            color={Color.BLUE}
          />
          <Text>Fester Zeitraum:</Text>
        </Pressable>
        {range.startDate && range.endDate && (
          <Text>
            {prettyDate(formatDate(range.startDate!), false) +
              " - " +
              prettyDate(formatDate(range.endDate!), false)}
          </Text>
        )}
        <View style={tw`flex-row`}>
          <Button
            onPress={() => {
              setOpen(true);
              setSelectedRadio("second");
            }}
          >
            Zeitraum auswählen
          </Button>
        </View>
        <DatePickerModal
          locale="de"
          mode="range"
          visible={open}
          onDismiss={() => setOpen(false)}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
        />

        <ErrorDisplay error={error} hasError={!!error} />
      </View>

      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={router.back} color={Color.RED}>
          Abbrechen
        </Button>
        <Button
          onPress={() => {
            if (selectedRadio == "first") {
              Store.update((state) => {
                state.printDateStart = fromDate;
                state.printDateEnd = toDate;
              });
            } else if (selectedRadio == "second") {
              if (!range.startDate || !range.endDate) {
                setError("Der Zeitraum muss komplett angegeben werden!");
                return;
              }
              Store.update((state) => {
                state.printDateStart = range.startDate!;
                state.printDateEnd = range.endDate!;
              });
            }
            router.back();
            router.push("/modules/print/columns");
          }}
          color={Color.BLUE}
        >
          Weiter
        </Button>
      </View>
    </CenterModal>
  );
};

export default SelectPrintRange;
