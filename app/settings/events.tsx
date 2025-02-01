import { Picker as RNPicker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import H1 from "@/components/elements/H1";
import Image from "@/components/elements/Image";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import Picker from "@/components/elements/Picker";
import SingleDatePicker from "@/components/elements/SingleDatePicker";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import useAllRecurringEvents from "@/hooks/api/useAllRecurringEvents";
import useCreateEvent from "@/hooks/api/useCreateEvent";
import useDeleteRecurringEvent from "@/hooks/api/useDeleteRecurringEvent";
import tw from "@/tailwind";

export default function ManageEventsScreen() {
  const {
    createEvent,
    hasCreationError,
    creationError,
    successfulEventCreation,
    singleDateCreated,
  } = useCreateEvent();

  const { deleteRecurringEvent, successfulDelete } = useDeleteRecurringEvent();

  const deleteModal = useRef<ModalHandle>(null);

  const { allRecurringEvents, queryRecurringEvents } = useAllRecurringEvents();

  const [createType, setCreateType] = useState<EventType>("UNSET");
  const [singleDate, setSingleDate] = useState<CalendarDate>(undefined);

  const [dayOfWeek, setDayOfWeek] = useState("1");

  const [dayOfMonth, setDayOfMonth] = useState("1");

  const [monthOfYear, setMonthOfYear] = useState("1");

  const [eventIdToDelete, setEventIdToDelete] = useState(0);
  const [eventNameToDelete, setEventNameToDelete] = useState("");
  const [eventTypeToDelete, setEventTypeToDelete] = useState<
    "YEARLY" | "MONTHLY" | "WEEKLY"
  >();

  const weekdayMap = {
    1: "Montag",
    2: "Dienstag",
    3: "Mittwoch",
    4: "Donnerstag",
    5: "Freitag",
    6: "Samstag",
    7: "Sonntag",
  };

  const monthMap = {
    1: "Januar",
    2: "Februar",
    3: "März",
    4: "April",
    5: "Mai",
    6: "Juni",
    7: "Juli",
    8: "August",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Dezember",
  };

  const formatEvent = (
    type: EventType,
    dayOfWeek: number,
    dayOfMonth: number,
    monthOfYear: number,
  ): string => {
    switch (type) {
      case "WEEKLY":
        return "Jede Woche " + weekdayMap[dayOfWeek as keyof typeof weekdayMap];
      case "MONTHLY":
        return "Jeden Monat am " + dayOfMonth + ".";
      case "YEARLY":
        return (
          "Jedes Jahr am " +
          dayOfMonth +
          ". " +
          monthMap[monthOfYear as keyof typeof monthMap]
        );
    }
    return "";
  };

  useEffect(() => {
    if (successfulEventCreation) {
      queryRecurringEvents();
    }
  }, [successfulEventCreation]);

  useEffect(() => {
    if (successfulDelete) {
      setTimeout(() => {
        queryRecurringEvents();
        deleteModal.current?.closeModal();
      }, 200);
    }
  }, [successfulDelete]);

  return (
    <SettingsLayout actualSetting="events">
      <SettingsTitle>Termine erstellen</SettingsTitle>

      <SettingsForm>
        <CustomText>
          Hier können einzelne oder regelmäßige Termine eingetragen, eingesehen
          und gelöscht werden. Dazu muss als erstes im Formular der Termintyp
          ausgewählt werden. Danach besteht die Eingabemöglichkeit für weitere
          Angaben.
        </CustomText>

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
        {createType === "SINGLE" && (
          <SingleDatePicker setDate={setSingleDate} />
        )}

        {/* Weekly Event */}
        {createType === "WEEKLY" && (
          <Picker
            selectedValue={dayOfWeek}
            onValueChange={(item) => setDayOfWeek(item)}
          >
            <RNPicker.Item label="Montags" value="1" />
            <RNPicker.Item label="Dienstags" value="2" />
            <RNPicker.Item label="Mittwochs" value="3" />
            <RNPicker.Item label="Donnerstags" value="4" />
            <RNPicker.Item label="Freitags" value="5" />
            <RNPicker.Item label="Samstags" value="6" />
            <RNPicker.Item label="Sonntags" value="7" />
          </Picker>
        )}

        {/* Monthly Event */}
        {createType === "MONTHLY" && (
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
        {createType === "YEARLY" && [
          <Picker
            key={1}
            selectedValue={monthOfYear}
            onValueChange={(item) => setMonthOfYear(item)}
          >
            <RNPicker.Item label="Januar" value="1" />
            <RNPicker.Item label="Februar" value="2" />
            <RNPicker.Item label="März" value="3" />
            <RNPicker.Item label="April" value="4" />
            <RNPicker.Item label="Mai" value="5" />
            <RNPicker.Item label="Juni" value="6" />
            <RNPicker.Item label="Juli" value="7" />
            <RNPicker.Item label="August" value="8" />
            <RNPicker.Item label="September" value="9" />
            <RNPicker.Item label="Oktober" value="10" />
            <RNPicker.Item label="November" value="11" />
            <RNPicker.Item label="Dezember" value="12" />
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

        <CustomText
          style={tw.style(
            {
              hidden: !singleDateCreated,
            },
            "text-green-500 mb-2",
          )}
        >
          Einzeltermin erfolgreich erstellt
        </CustomText>

        <Button
          onPress={() => {
            createEvent(
              createType,
              singleDate,
              Number(dayOfWeek),
              Number(dayOfMonth),
              Number(monthOfYear),
            );
          }}
        >
          Termin erstellen
        </Button>
      </SettingsForm>
      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Termine", ""]}></TH>

          {allRecurringEvents?.map((event) => (
            <TR key={event.id + event.eventType}>
              <TD style={tw`justify-center`} cols={2}>
                <CustomText style={tw`text-lg`}>
                  {formatEvent(
                    event.eventType,
                    event.dayOfWeek || 0,
                    event.dayOfMonth || 0,
                    event.eventMonth || 0,
                  )}
                </CustomText>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={2}>
                <Button
                  color="#f67e7e"
                  className="p-2.5"
                  onPress={() => {
                    setEventIdToDelete(event.id);
                    setEventTypeToDelete(event.eventType);
                    setEventNameToDelete(
                      formatEvent(
                        event.eventType,
                        event.dayOfWeek || 0,
                        event.dayOfMonth || 0,
                        event.eventMonth || 0,
                      ),
                    );
                    deleteModal.current?.openModal();
                  }}
                >
                  <Image source={require("@/assets/img/close.svg")} size={24} />
                </Button>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <Modal type="CENTER" ref={deleteModal}>
        <H1 style={tw`mt-2 text-center`}>Plan löschen?</H1>
        <CustomText style={tw`mx-4`}>
          Soll der Termin{" "}
          <CustomText style={tw`font-semibold`}>{eventNameToDelete}</CustomText>{" "}
          wirklich glöscht werden?
        </CustomText>
        <CustomText style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden alle Eintragungen von Mitgliedern zu{" "}
          <CustomText style={tw`font-semibold`}>allen</CustomText> zugehörigen
          Terminen gelöscht. Dies kann nicht mehr Rückgängig gemacht werden!
        </CustomText>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteRecurringEvent(eventIdToDelete, eventTypeToDelete!);
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
}
