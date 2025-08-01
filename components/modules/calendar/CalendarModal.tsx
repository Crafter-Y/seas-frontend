import * as ExpoCalendar from "expo-calendar";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useContext, useState } from "react";
import { Platform, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import ErrorDisplay from "@/components/ErrorDisplay";
import { AppContext } from "@/helpers/appContext";
import { Store } from "@/helpers/store";
import tw from "@/tailwind";

const CALENDAR_NAME = "SEAS Termine";

export default function CalendarModal() {
  const [calendarError, setCalendarError] = useState<string>();

  const [syncSuccessful, setSyncSuccessful] = useState(false);

  const { user, serverName } = useContext(AppContext);

  const { from, to, board } = Store.useState((state) => ({
    from: state.lastQueryFrom,
    to: state.lastQueryTo,
    board: state.board,
  }));

  const getDefaultCalendarSource = async () => {
    const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  };

  const getApplicableDates = () => {
    if (from === null || to === null || board.length === 0) return [];

    return board
      .filter((entry) => entry.assignments.length !== 0)
      .filter(
        (entry) =>
          entry.assignments.filter(
            (assignment) => assignment.userId === user?.id,
          ).length !== 0,
      )
      .map((entry) => entry.date);
  };

  const syncCalendar = async () => {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      setCalendarError(undefined);
      const calendars = await ExpoCalendar.getCalendarsAsync(
        ExpoCalendar.EntityTypes.EVENT,
      );

      const defaultCalendarSource =
        Platform.OS === "ios"
          ? await getDefaultCalendarSource()
          : {
              isLocalAccount: true,
              name: CALENDAR_NAME,
              id: CALENDAR_NAME,
              type: ExpoCalendar.EntityTypes.EVENT,
            };

      const expoCalendar = calendars.find((cal) => cal.name === CALENDAR_NAME);
      let calId;

      if (!expoCalendar) {
        const newCalendarID = await ExpoCalendar.createCalendarAsync({
          title: CALENDAR_NAME,
          color: "blue",
          entityType: ExpoCalendar.EntityTypes.EVENT,
          sourceId: defaultCalendarSource.id,
          source: defaultCalendarSource,
          name: CALENDAR_NAME,
          ownerAccount: "personal",
          accessLevel: ExpoCalendar.CalendarAccessLevel.OWNER,
        });

        calId = newCalendarID;
      } else {
        calId = expoCalendar.id;
      }

      if (from === null || to === null) {
        setCalendarError("Es gab einen Fehler beim erstellen der Einträge");
        return;
      }

      const allEvents = await ExpoCalendar.getEventsAsync([calId], from!, to!);

      const datesToExist = getApplicableDates();

      // first delete all events the user is no longer assigned to
      for (let i = 0; i < allEvents.length; i++) {
        const event = allEvents[i];

        if (
          datesToExist.filter(
            (dateStr) => new Date(dateStr).toISOString() === event.startDate,
          ).length === 0
        ) {
          await ExpoCalendar.deleteEventAsync(event.id);
        }
      }

      // then create an event for every date the user is assigned to
      for (let i = 0; i < datesToExist.length; i++) {
        const date = datesToExist[i];

        if (
          allEvents.filter(
            (event) => event.startDate === new Date(date).toISOString(),
          ).length !== 0
        )
          continue;

        await ExpoCalendar.createEventAsync(calId, {
          calendarId: calId,
          title: serverName!,
          creationDate: new Date(),
          lastModifiedDate: new Date(),
          startDate: new Date(date),
          endDate: new Date(date),
          allDay: true,
          notes: "Sie sind an diesem Tag eingeteilt",
        });
      }

      setSyncSuccessful(true);
    } else {
      setCalendarError("Zugiff auf Kalender verwehrt");
    }
  };

  const constructICSFile = () => {
    const datesToExist = getApplicableDates();

    let icsContent = `BEGIN:VCALENDAR
PRODID:SEAS
VERSION:2.0
CALSCALE:GREGORIAN`;

    datesToExist.forEach((date) => {
      icsContent += `
BEGIN:VEVENT
SUMMARY:${serverName}
DTSTART;VALUE=DATE:${date.replaceAll("-", "")}
UID:${date}@SEAS
END:VEVENT`;
    });

    icsContent += "\nEND:VCALENDAR";

    return icsContent;
  };

  const downloadICS = async () => {
    const datesToExist = getApplicableDates();
    if (datesToExist.length === 0) {
      setCalendarError("Es gibt keine Eintragung in diesem Zeitraum");
      return;
    }

    const icsContent = constructICSFile();

    if (Platform.OS === "web") {
      const anchor = document.createElement("a");
      const blob = new Blob([icsContent], { type: "text/calendar" });
      anchor.href = URL.createObjectURL(blob);
      anchor.download = new Date().getTime() + ".ics";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) return;

    const fileUri = FileSystem.cacheDirectory! + new Date().getTime() + ".ics";

    await FileSystem.writeAsStringAsync(fileUri, icsContent);

    await Sharing.shareAsync(fileUri, {
      mimeType: "text/calendar",
      dialogTitle: "Kalender teilen",
    });
  };

  const androidReallySave = async () => {
    const datesToExist = getApplicableDates();
    if (datesToExist.length === 0) {
      setCalendarError("Es gibt keine Eintragung in diesem Zeitraum");
      return;
    }

    const icsContent = constructICSFile();

    const fileUri = FileSystem.cacheDirectory! + new Date().getTime() + ".ics";

    await FileSystem.writeAsStringAsync(fileUri, icsContent);

    const androidDirectPermission =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (androidDirectPermission.granted) {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
        androidDirectPermission.directoryUri,
        new Date().getTime() + ".ics",
        "text/calendar",
      );

      await FileSystem.writeAsStringAsync(newUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return;
    }
  };
  return (
    <>
      <View
        style={tw.style(
          {
            hidden: Platform.OS === "web",
          },
          "my-2 mx-2",
        )}
      >
        <View className="gap-2">
          <CustomText>
            Den angezeigten Plan mit dem Kalender synchronisieren?
          </CustomText>
          <Button onPress={() => syncCalendar()}>Jetzt synchronisieren</Button>
        </View>
      </View>
      <View style={tw`my-2 mx-2 gap-2`}>
        <ErrorDisplay error={calendarError} hasError={!!calendarError} />
        {syncSuccessful && (
          <CustomText style={tw`text-green-500`}>
            Kalender erfolgreich synchronisiert
          </CustomText>
        )}
        <CustomText>Die angezeigten Termine downloaden:</CustomText>
        <Button onPress={() => downloadICS()}>
          {Platform.OS === "android" ? ".ics teilen" : "Download .ics"}
        </Button>
        {Platform.OS === "android" && (
          <Button onPress={() => androidReallySave()}>Download .ics</Button>
        )}
      </View>
    </>
  );
}
