import { Text } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import H2 from "@/components/elements/H2";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import SettingsForm from "@/components/SettingsForm";
import Picker from "@/components/elements/Picker";
import { Picker as RNPicker } from "@react-native-picker/picker";
import SingleDatePicker from "@/components/elements/SingleDatePicker";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import useCreateEvent from "@/hooks/api/useCreateEvent";
import ErrorDisplay from "@/components/ErrorDisplay";

export type ManageEventsScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageEventsScreen"
>;

const ManageEventsScreen = () => {
  const navigation = useNavigation<ManageEventsScreenProps>();

  const { isMd } = useMediaQueries();

  const {
    createEvent,
    hasCreationError,
    creationError,
    successfulEventCreation,
    singleDateCreated,
  } = useCreateEvent();

  const [createType, setCreateType] = useState<EventType>("UNSET");
  const [singleDate, setSingleDate] = useState<CalendarDate>(undefined);

  const [dayOfWeek, setDayOfWeek] = useState<Weekday>("MONDAY");

  const [dayOfMonth, setDayOfMonth] = useState("1");

  const [monthOfYear, setMonthOfYear] = useState<Month>("JANUARY");

  useEffect(() => {
    if (successfulEventCreation) {
      // TODO: refresh recurring events
    }
  }, [successfulEventCreation]);

  return (
    <SettingsLayout navigation={navigation}>
      <H2
        style={tw.style(
          {
            "text-center": !isMd,
          },
          "mt-4"
        )}
      >
        Termine erstellen
      </H2>

      <SettingsForm>
        <Text>
          Hier können einzelne oder regelmäßige Termine eingetragen, eingesehen
          und gelöscht werden. Dazu muss als erstes im Formular der Termintyp
          ausgewählt werden. Danach besteht die Eingabemöglichkeit für weitere
          Angaben.
        </Text>

        {/* Event Type Selector */}
        <Picker
          selectedValue={createType}
          onValueChange={(itemValue) => setCreateType(itemValue as EventType)}
        >
          <RNPicker.Item label="Typ auswählen" value="UNSET" enabled={false} />
          <RNPicker.Item label="Einmaliger Termin" value="SINGLE" />
          <RNPicker.Item label="Wöchentlich" value="WEEKLY" />
          <RNPicker.Item label="Monatlich" value="MONTHLY" />
          <RNPicker.Item label="Jährlich" value="YEARLY" />
        </Picker>

        {/* Single Event */}
        {createType == "SINGLE" && <SingleDatePicker setDate={setSingleDate} />}

        {/* Weekly Event */}
        {createType == "WEEKLY" && (
          <Picker
            selectedValue={dayOfWeek}
            onValueChange={(item) => setDayOfWeek(item as Weekday)}
          >
            <RNPicker.Item label="Montags" value="MONDAY" />
            <RNPicker.Item label="Dienstags" value="TUESDAY" />
            <RNPicker.Item label="Mittwochs" value="WEDNESDAY" />
            <RNPicker.Item label="Donnerstags" value="THURSDAY" />
            <RNPicker.Item label="Freitags" value="FRIDAY" />
            <RNPicker.Item label="Samstags" value="SATURDAY" />
            <RNPicker.Item label="Sonntags" value="SUNDAY" />
          </Picker>
        )}

        {/* Monthly Event */}
        {createType == "MONTHLY" && (
          <Picker
            selectedValue={dayOfMonth}
            onValueChange={(item) => setDayOfMonth(item)}
          >
            {Array(31)
              .fill("dummy")
              .map((element, index) => (
                <RNPicker.Item
                  label={"am " + (index + 1) + "."}
                  value={index + 1 + ""}
                  key={index}
                />
              ))}
          </Picker>
        )}

        {/* Yearly Event */}
        {createType == "YEARLY" && [
          <Picker
            key={1}
            selectedValue={monthOfYear}
            onValueChange={(item) => setMonthOfYear(item as Month)}
          >
            <RNPicker.Item label="Januar" value="JANUARY" />
            <RNPicker.Item label="Februar" value="FEBRUARY" />
            <RNPicker.Item label="März" value="MARCH" />
            <RNPicker.Item label="April" value="APRIL" />
            <RNPicker.Item label="Mai" value="MAY" />
            <RNPicker.Item label="Juni" value="JUNE" />
            <RNPicker.Item label="Juli" value="JULI" />
            <RNPicker.Item label="August" value="AUGUST" />
            <RNPicker.Item label="September" value="SEPTEMBER" />
            <RNPicker.Item label="Oktober" value="OCTOBER" />
            <RNPicker.Item label="November" value="NOVEMBER" />
            <RNPicker.Item label="Dezember" value="DECEMBER" />
          </Picker>,
          <Picker
            key={2}
            selectedValue={dayOfMonth}
            onValueChange={(item) => setDayOfMonth(item)}
          >
            {Array(31)
              .fill("dummy")
              .map((element, index) => (
                <RNPicker.Item
                  label={"am " + (index + 1) + "."}
                  value={index + 1 + ""}
                  key={index}
                />
              ))}
          </Picker>,
        ]}

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Text
          style={tw.style(
            {
              hidden: !singleDateCreated,
            },
            "text-green-500 mb-2"
          )}
        >
          Einzeltermin erfolgreich erstellt
        </Text>

        <Button
          onPress={() => {
            createEvent(
              navigation,
              createType,
              singleDate,
              dayOfWeek,
              dayOfMonth,
              monthOfYear
            );
          }}
        >
          Termin erstellen
        </Button>
      </SettingsForm>
      <Divider type="HORIZONTAL" style={tw`my-4`} />
    </SettingsLayout>
  );
};

export default ManageEventsScreen;
