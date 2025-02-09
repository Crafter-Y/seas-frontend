import { AntDesign } from "@expo/vector-icons";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { useState } from "react";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, { CurvedTransition } from "react-native-reanimated";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import { requestApi } from "@/helpers/api";
import { Color } from "@/helpers/Constants";
import { formatDate, prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import useAllColumns from "@/hooks/api/useAllColumns";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import tw from "@/tailwind";

type Item = { text: string; key: number };

type Props = {
  closeModal: () => void;
  openColumnsModal: () => void;
};

export default function PrintOrderModal({
  closeModal,
  openColumnsModal,
}: Props) {
  const printColumns = Store.useState((state) => state.printColumns);

  const { allColumns } = useAllColumns();

  const { allExistingUsers } = useAllExistingUsers();

  const { serverName, printStart, printEnd } = Store.useState((state) => ({
    serverName: state.serverName,
    printStart: state.printDateStart,
    printEnd: state.printDateEnd,
  }));

  const initialData: Item[] = [...new Set(printColumns)].map((el) => ({
    key: el,
    text: allColumns.filter((col) => col.id === el)[0].name,
  }));

  initialData.unshift({
    key: -1,
    text: "Termin (Datum)",
  });

  const [data, setData] = useState(initialData);

  const mapPrintEntry = (row: BoardRow, columnId: number) => {
    if (columnId === -1) return prettyDate(row.date, false);

    const matchingComment = row.comments.filter(
      (comment) => comment.boardColumnId === columnId,
    )[0];
    if (matchingComment) return matchingComment.text;

    const matchingAssignment = row.assignments.filter(
      (entry) => entry.boardColumnId === columnId,
    )[0];
    if (!matchingAssignment) return "";

    const matchingUser = allExistingUsers.filter(
      (user) => user.id === matchingAssignment.userId,
    )[0];
    if (!matchingUser) return "";

    return matchingUser.firstname + " " + matchingUser.lastname;
  };

  const createHTML = async () => {
    const res = await requestApi(
      `board?from=${formatDate(printStart!)}&to=${formatDate(printEnd!)}`,
      "GET",
    );

    const board: BoardRow[] = res?.data;

    return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="margin: 0; padding: ${
    Platform.OS === "web" ? 0 : "1.2cm"
  }; min-height: 100vh;">
    <div style="display: flex; flex-wrap: wrap;">
      <span style="width: 100%; text-align: center; opacity: 0.8; font-weight: 700; font-size: 2.25rem; line-height: 2.5rem;">${serverName}</span>
      <span style="width: 100%; text-align: center; opacity: 0.8; font-weight: 600; font-size: 1.5rem; line-height: 2rem;">${
        prettyDate(formatDate(printStart!), false) +
        " - " +
        prettyDate(formatDate(printEnd!), false)
      }</span>
    </div>
    <table style="table-layout: fixed; width: 100%; box-sizing: border-box; margin-top: 0.5rem; border: 2px solid black; page-break-inside: auto; text-indent: 0; border-collapse: collapse;">
      <thead>
        <tr>
          ${data
            .map(
              (el) => `<th 
                style="text-transform: uppercase; font-size: 0.875rem; line-height: 1.25rem; padding-left: 0.25rem; padding-right: 0.25rem; overflow: hidden; border: 2px solid black;"
              >
                ${el.text}
              </th>`,
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${board
          .map(
            (row) => `<tr>
              ${data
                .map(
                  (
                    col,
                  ) => `<td style="font-size: 1rem; line-height: 1.5rem; padding: 0.25rem; white-space: normal; overflow: hidden; border: 2px solid black;">
                ${mapPrintEntry(row, col.key)}
              </td>`,
                )
                .join("")}
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>`;
  };

  const print = async () => {
    const html = await createHTML();

    if (Platform.OS === "web") {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none"; // Hide the iframe
      document.body.appendChild(iframe);

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      const closePrint = () => {
        document.body.removeChild(iframe);
      };

      iframe.contentWindow!.onbeforeunload = closePrint;
      iframe.contentWindow!.onafterprint = closePrint;
      iframe.contentWindow!.print();

      return;
    }

    Print.printAsync({
      html,
    }).catch(() => {}); // ignoring rejection (ios rejects on cancel)
  };

  const pdf = async () => {
    const html = await createHTML();

    const { uri } = await Print.printToFileAsync({ html });

    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...data]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    setData(copy);
  }

  return (
    <>
      <View style={tw`px-4`}>
        <CustomText>
          Sie können hier die Reihenfolge ändern. Der oberste Eintrag wird auf
          dem Plan ganz links sein.
        </CustomText>
        <Divider type="HORIZONTAL" style={tw`mt-2 mb-4`} />

        <View style={tw`gap-1`}>
          {data.map((row, idx, arr) => (
            <Animated.View
              // TODO: seems to be not working on chrome web - maybe broken otherwhere?
              key={row.key}
              style={tw`flex-row p-2 border items-center justify-between`}
              layout={CurvedTransition.duration(150).delay(50)}
            >
              <CustomText>{row.text}</CustomText>
              <View style={tw`flex-row`}>
                {idx !== 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      onReordered(idx, idx - 1);
                    }}
                    style={tw`p-2 w-10 rounded-full`}
                  >
                    <AntDesign name="caretup" size={25} color="gray" />
                  </TouchableOpacity>
                )}
                {idx !== arr.length - 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      onReordered(idx, idx + 1);
                    }}
                    style={tw`p-2 w-10 rounded-full`}
                  >
                    <AntDesign name="caretdown" size={25} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        <Divider type="HORIZONTAL" style={tw`mt-4 mb-2`} />
      </View>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={print} color={Color.BLUE}>
          Drucken
        </Button>
        <Button onPress={pdf} color={Color.BLUE} className="web:hidden">
          Als .pdf exportieren
        </Button>
      </View>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal} color={Color.RED}>
          Abbrechen
        </Button>
        <Button
          onPress={() => {
            closeModal();
            openColumnsModal();
          }}
          color={Color.BLUE}
        >
          Zurück
        </Button>
      </View>
    </>
  );
}
