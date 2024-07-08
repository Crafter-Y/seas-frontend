import Divider from "@/components/elements/Divider";
import tw from "@/tailwind";
import {
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Store } from "@/helpers/store";
import useAllColumns from "@/hooks/api/useAllColumns";
import Button from "@/components/elements/Button";
import { Color } from "@/helpers/Constants";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useState } from "react";
import useMediaQueries from "@/hooks/useMediaQueries";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { formatDate, prettyDate } from "@/helpers/format";
import { requestApi } from "@/helpers/api";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";

type Item = { text: string; key: number };

type Props = {
  closeModal?: () => void;
  openColumnsModal?: () => void;
};

export default function PrintOrderModal({
  closeModal,
  openColumnsModal,
}: Props) {
  const printColumns = Store.useState((state) => state.printColumns);

  const { width } = useWindowDimensions();

  const { isSm } = useMediaQueries();

  const { allColumns } = useAllColumns();

  const { allExistingUsers } = useAllExistingUsers();

  const { serverName, printStart, printEnd } = Store.useState((state) => ({
    serverName: state.serverName,
    printStart: state.printDateStart,
    printEnd: state.printDateEnd,
  }));

  const initialData: Item[] = [...new Set(printColumns)].map((el) => ({
    key: el,
    text: allColumns.filter((col) => col.id == el)[0].name,
  }));

  initialData.unshift({
    key: -1,
    text: "Termin (Datum)",
  });

  const [data, setData] = useState(initialData);

  const mapPrintEntry = (row: BoardRow, columnId: number) => {
    if (columnId == -1) return prettyDate(row.date, false);

    const matchingComment = row.comments.filter(
      (comment) => comment.boardColumnId == columnId
    )[0];
    if (matchingComment) return matchingComment.text;

    const matchingAssignment = row.assignments.filter(
      (entry) => entry.boardColumnId == columnId
    )[0];
    if (!matchingAssignment) return "";

    const matchingUser = allExistingUsers.filter(
      (user) => user.id == matchingAssignment.userId
    )[0];
    if (!matchingUser) return "";

    return matchingUser.firstname + " " + matchingUser.lastname;
  };

  const createHTML = async () => {
    const res = await requestApi(
      `board?from=${formatDate(printStart!)}&to=${formatDate(printEnd!)}`,
      "GET"
    );

    const board: BoardRow[] = res?.data;

    return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="margin: 0; padding: 0; min-height: 100vh;">
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
              </th>`
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
                    col
                  ) => `<td style="font-size: 1rem; line-height: 1.5rem; padding: 0.25rem; white-space: normal; overflow: hidden; border: 2px solid black;">
                ${mapPrintEntry(row, col.key)}
              </td>`
                )
                .join("")}
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>`;
  };

  const print = async () => {
    const html = await createHTML();
    if (Platform.OS == "web") {
      const pW = window.open("", "", "height=500, width=500");
      pW?.document.write(html);
      pW?.document.close();
      pW?.print();
      return;
    }
    await Print.printAsync({
      html,
    });
  };

  const pdf = async () => {
    const html = await createHTML();

    const { uri } = await Print.printToFileAsync({ html });

    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onPressIn={drag}
          activeOpacity={1}
          disabled={isActive}
          style={tw.style(
            {
              "mx-6": isActive,
            },
            "border-2 rounded-md border-gray-400 bg-gray-200 px-1 py-2 my-1"
          )}
        >
          <Text style={tw`font-semibold text-lg text-center`}>{item.text}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <>
      <View style={tw`px-4`}>
        <Text>Per Drag&Drop die Reihenfolge ändern</Text>
        <Divider type="HORIZONTAL" style={tw`mt-2 mb-4`} />
        <View style={tw`flex-row`}>
          <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.key + ""}
            renderItem={renderItem}
            style={{
              width:
                (Platform.OS == "web"
                  ? isSm
                    ? width / 2
                    : width * 0.75
                  : width) / 2,
            }}
          />
        </View>

        <Divider type="HORIZONTAL" style={tw`mt-4 mb-2`} />
      </View>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={print} color={Color.BLUE}>
          Drucken
        </Button>
        <Button
          onPress={pdf}
          color={Color.BLUE}
          style={tw.style({
            hidden: Platform.OS == "web",
          })}
        >
          Als .pdf exportieren
        </Button>
      </View>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal} color={Color.RED}>
          Abbrechen
        </Button>
        <Button
          onPress={() => {
            closeModal?.();
            openColumnsModal?.();
          }}
          color={Color.BLUE}
        >
          Zurück
        </Button>
      </View>
    </>
  );
}
