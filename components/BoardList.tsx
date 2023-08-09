import { View, Text, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import useBoard from "@/hooks/api/useBoard";
import { formatDate, prettyDate } from "@/helpers/format";
import Form from "@/components/elements/Form";
import TH from "./elements/TH";
import useAllColumns from "@/hooks/api/useAllColumns";
import TD from "./elements/TD";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import PressableTR from "./elements/PressableTR";
import useAuthentication from "@/hooks/api/useAuthentication";
import BoardAssignButton from "./BoardAssignButton";
import useAssignUser from "@/hooks/api/useAssignUser";
import { BoardScreenProps } from "@/screens/BoardScreen";
import Modal, { ModalHandle } from "./elements/Modal";
import Divider from "./elements/Divider";

type Props = {
  dateStart: Date;
  dateEnd: Date;
  currentPage: string;
  navigation: BoardScreenProps;
  allPages: APIResponsePage[]
};
const BoardList = ({ dateStart, dateEnd, currentPage, navigation, allPages }: Props) => {
  const { isSm } = useMediaQueries();

  const lastRequest = useRef(new Date());

  const { rows, queryBoard } = useBoard();
  const { allColumns } = useAllColumns();
  const { allExistingUsers } = useAllExistingUsers();

  const [titles, setTitles] = useState<string[]>([]);

  const { user } = useAuthentication();

  const { assignUser, assignmentSuccessful } = useAssignUser();

  const rowModal = useRef<ModalHandle>(null);
  const [selectedRow, setSelectedRow] = useState<BoardRow>();

  useEffect(() => {
    lastRequest.current = new Date();
    setTimeout(() => {
      if (new Date().getTime() - lastRequest.current.getTime() < 200) return;
      fetchData(dateStart, dateEnd);
    }, 200);
  }, [dateStart, dateEnd]);

  useEffect(() => {
    if (assignmentSuccessful) fetchData(dateStart, dateEnd);
  }, [assignmentSuccessful]);

  const fetchData = (start: Date, end: Date) => {
    queryBoard(formatDate(start), formatDate(end));
    console.log("query", start, end);
  };

  const getCommentForField = (column: APIResponseColumn, row: BoardRow) => {
    let commentExist =
      row.assignments.filter((row_) => row_.columnId == column.columnId)
        .length == 1;

    if (commentExist) {
      return row.assignments.filter(
        (row_) => row_.columnId == column.columnId
      )[0].value;
    }
    return "-";
  };

  const getPositionForField = (column: APIResponseColumn, row: BoardRow) => {
    let positionUsed =
      row.assignments.filter((row_) => row_.columnId == column.columnId)
        .length == 1;

    if (positionUsed) {
      let usersWithCol = allExistingUsers.filter(
        (user) =>
          user.userId ==
          row.assignments.filter((row_) => row_.columnId == column.columnId)[0]
            .value
      );

      if (usersWithCol.length == 1) {
        if (usersWithCol[0].userId == user?.userId) {
          return (
            <Text style={tw`font-semibold underline`}>
              {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
            </Text>
          );
        }

        return (
          <Text>
            {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          </Text>
        );
      }

      return <Text>"Unbekanntes Mitglied"</Text>;
    }
    if (
      row.assignments
        .filter((assignment) => assignment.type == "POSITION")
        .map((assignment) => assignment.value)
        .includes(user?.userId!)
    ) {
      return <Text>-</Text>;
    }

    return (
      <BoardAssignButton
        onPress={() =>
          assignUser(user?.userId!, row.date, column.columnId, navigation)
        }
      />
    );
  };

  useEffect(() => {
    let titles = [];
    titles.push("Termin");

    allColumns.forEach((column) => {
      if (
        column.pages.includes("page_" + currentPage) &&
        column.type == "POSITION"
      ) {
        titles.push(column.name);
      }
    });
    allColumns.forEach((column) => {
      if (
        column.pages.includes("page_" + currentPage) &&
        column.type == "COMMENT"
      ) {
        titles.push(column.name);
      }
    });
    setTitles(titles);
  }, [currentPage, allColumns]);

  return (
    <View
      style={tw.style({
        "px-0": !isSm,
        "px-6": isSm,
      })}
    >
      <Form style={tw`mb-4`}>
        <TH titles={titles} />
        {rows.map((row) => (
          <PressableTR
            key={row.date}
            onPress={() => {
              setSelectedRow(row)
              rowModal.current?.toggleModal()
            }}
          >
            <TD style={tw`justify-center`} cols={titles.length}>
              <Text>{prettyDate(row.date, !isSm)}</Text>
            </TD>
            {allColumns
              .filter(
                (col) =>
                  col.pages.includes("page_" + currentPage) &&
                  col.type == "POSITION"
              )
              .map((col) => (
                <TD
                  key={col.columnId}
                  style={tw`justify-center`}
                  cols={titles.length}
                >
                  {getPositionForField(col, row)}
                </TD>
              ))}
            {allColumns
              .filter(
                (col) =>
                  col.pages.includes("page_" + currentPage) &&
                  col.type == "COMMENT"
              )
              .map((col) => (
                <TD
                  key={col.columnId}
                  style={tw`justify-center`}
                  cols={titles.length}
                >
                  <Text>{getCommentForField(col, row)}</Text>
                </TD>
              ))}
          </PressableTR>
        ))}
      </Form>

      <Modal type="CENTER" ref={rowModal}>
        <Text style={tw`text-center text-2xl underline my-2 font-semibold`}>{selectedRow ? prettyDate(selectedRow.date, false) : ""}</Text>

        <Divider type="HORIZONTAL" />

        <View style={tw`px-2`}>
          {/* Display the selected page on top */}
          {allPages.filter(page => page.pageId == currentPage).map(page => (
            <Text style={tw`text-lg `} key="This should not error">{page.name}:</Text>
          ))}

          {/* Other pages below */}
          {/* TODO: In the future, it should be checked if the user has the permission to see that page/segment */}
          {allPages.filter(page => page.pageId != currentPage).map(page => (
            <View key={page.pageId}>
              <Divider type="HORIZONTAL" />
              <Text style={tw`text-lg `}>{page.name}:</Text>
            </View>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default BoardList;
