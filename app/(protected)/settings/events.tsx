import { Picker as RNPicker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import Image from "@/components/elements/Image";
import { ModalHandle } from "@/components/elements/Modal";
import ModalRewrite from "@/components/elements/ModalRewrite";
import Picker from "@/components/elements/Picker";
import SingleDatePicker from "@/components/elements/SingleDatePicker";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import DeleteEventModal from "@/components/settings/DeleteEventModal";
import SettingsActionButton from "@/components/settings/SettingsActionButton";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import { Color } from "@/helpers/Constants";
import { formatEvent } from "@/helpers/format";
import useAllRecurringEvents, {
  DisplayableRecurringEvent,
} from "@/hooks/api/useAllRecurringEvents";
import useCreateEvent from "@/hooks/api/useCreateEvent";

export default function ManageEventsScreen() {
  const {
    createEvent,
    hasCreationError,
    creationError,
    successfulEventCreation,
    singleDateCreated,
  } = useCreateEvent();

  const { t } = useTranslation();

  const deleteModal = useRef<ModalHandle>(null);

  const { allRecurringEvents, queryRecurringEvents } = useAllRecurringEvents();

  const [createType, setCreateType] = useState<EventType>("UNSET");
  const [singleDate, setSingleDate] = useState<CalendarDate>(undefined);

  const [dayOfWeek, setDayOfWeek] = useState("1");

  const [dayOfMonth, setDayOfMonth] = useState("1");

  const [monthOfYear, setMonthOfYear] = useState("1");

  const [selectedEvent, setSelectedEvent] =
    useState<DisplayableRecurringEvent>();

  useEffect(() => {
    if (successfulEventCreation) {
      queryRecurringEvents();
    }
  }, [queryRecurringEvents, successfulEventCreation]);

  return (
    <SettingsLayout actualSetting="events">
      <SettingsTitle t="createEvents" />

      <SettingsForm>
        <CustomText t="createEventDescription" />

        {/* Event Type Selector */}
        <Picker
          selectedValue={createType}
          onValueChange={(itemValue) => setCreateType(itemValue as EventType)}
        >
          <RNPicker.Item
            label={t("selectType")}
            value="UNSET"
            enabled={false}
          />
          <RNPicker.Item label={t("singleEvent")} value="SINGLE" />
          <RNPicker.Item label={t("weekly")} value="WEEKLY" />
          <RNPicker.Item label={t("monthly")} value="MONTHLY" />
          <RNPicker.Item label={t("yearly")} value="YEARLY" />
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
            <RNPicker.Item label={t("onMonday")} value="1" />
            <RNPicker.Item label={t("onTuesday")} value="2" />
            <RNPicker.Item label={t("onWednesday")} value="3" />
            <RNPicker.Item label={t("onThursday")} value="4" />
            <RNPicker.Item label={t("onFriday")} value="5" />
            <RNPicker.Item label={t("onSaturday")} value="6" />
            <RNPicker.Item label={t("onSunday")} value="7" />
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
                  label={t("onDayOfMonth", { day: index + 1 })}
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
            <RNPicker.Item label={t("janurary")} value="1" />
            <RNPicker.Item label={t("february")} value="2" />
            <RNPicker.Item label={t("march")} value="3" />
            <RNPicker.Item label={t("april")} value="4" />
            <RNPicker.Item label={t("may")} value="5" />
            <RNPicker.Item label={t("june")} value="6" />
            <RNPicker.Item label={t("july")} value="7" />
            <RNPicker.Item label={t("august")} value="8" />
            <RNPicker.Item label={t("september")} value="9" />
            <RNPicker.Item label={t("october")} value="10" />
            <RNPicker.Item label={t("november")} value="11" />
            <RNPicker.Item label={t("december")} value="12" />
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
                  label={t("onDayOfMonth", { day: index + 1 })}
                  value={index + 1 + ""}
                  key={index}
                />
              ))}
          </Picker>,
        ]}

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <CustomText
          className={`text-green-500 mb-2 ${singleDateCreated ? "" : "hidden"}`}
          t="singleEventCreated"
        />

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
          {t("createEvent")}
        </Button>
      </SettingsForm>
      <Divider type="HORIZONTAL" className="my-4" />

      <SettingsForm className="mb-8">
        <Form>
          <TH titles={[t("events"), ""]}></TH>

          {allRecurringEvents?.map((event) => (
            <TR key={event.id + event.eventType}>
              <TD className="justify-center" cols={2}>
                <CustomText className="text-lg">
                  {formatEvent(
                    event.eventType,
                    event.dayOfWeek || 0,
                    event.dayOfMonth || 0,
                    event.eventMonth || 0,
                  )}
                </CustomText>
              </TD>
              <TD className="justify-end flex-row items-center gap-1" cols={2}>
                <SettingsActionButton
                  color={Color.RED}
                  onPress={() => {
                    setSelectedEvent(event);
                    deleteModal.current?.openModal();
                  }}
                >
                  <Image source={require("@/assets/img/close.svg")} size={24} />
                </SettingsActionButton>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <ModalRewrite ref={deleteModal} title="modal.events.deleteEvent">
        <DeleteEventModal
          closeModal={() => deleteModal.current?.closeModal()}
          selectedEvent={selectedEvent}
          queryRecurringEvents={queryRecurringEvents}
        />
      </ModalRewrite>
    </SettingsLayout>
  );
}
