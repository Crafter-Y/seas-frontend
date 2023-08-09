import { View, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import useUnAssignUser from "@/hooks/api/useUnAssignUser";

type Props = {
  dateStart: Date;
  dateEnd: Date;
  currentPage: string;
  navigation: BoardScreenProps;
  allPages: APIResponsePage[]
};
const BoardList = ({ dateStart, dateEnd, currentPage, navigation, allPages }: Props) => {
  const { isSm } = useMediaQueries();

  const [renderdAllPages, setRenderdAllPages] = useState<APIResponsePage[]>([])

  const lastRequest = useRef(new Date());

  const { rows, queryBoard } = useBoard();
  const { allColumns } = useAllColumns();
  const { allExistingUsers } = useAllExistingUsers();

  const [titles, setTitles] = useState<string[]>([]);

  const { user } = useAuthentication();

  const { assignUser, assignmentSuccessful } = useAssignUser();
  const { unassignUser, unassignmentSuccessful } = useUnAssignUser();

  const rowModal = useRef<ModalHandle>(null);
  const [selectedRow, setSelectedRow] = useState<BoardRow>();

  useEffect(() => {
    setRenderdAllPages(JSON.parse(JSON.stringify(allPages)).sort((a: APIResponsePage) => a.pageId != currentPage ? 1 : -1));
  }, [allPages, currentPage, rows])

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

  useEffect(() => {
    if (unassignmentSuccessful) fetchData(dateStart, dateEnd);
  }, [unassignmentSuccessful]);

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

  const getPositionForField = (column: APIResponseColumn, row: BoardRow, type: "INLINE" | "MODAL") => {
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

      // The user exists
      if (usersWithCol.length == 1) {
        // This is the current user
        if (usersWithCol[0].userId == user?.userId) {

          // underlined name for the inline view
          if (type == "INLINE") return (
            <Text style={tw`font-semibold underline`}>
              {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
            </Text>
          );

          return (<BoardAssignButton
            type="EXIT"
            actionType="CROSS"
            text="Nicht mehr teilnehmen"
            onPress={() => {
              unassignUser(user?.userId!, row.date, column.columnId, navigation)
              rowModal.current?.toggleModal()
            }}
          />)
        }

        // the assignment is another known user
        if (type == "INLINE" || user?.role != "ADMIN") return (
          <Text>
            {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          </Text>
        );

        return (<BoardAssignButton
          type="EXIT"
          actionType="CROSS"
          text={usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          onPress={() => {
            unassignUser(user?.userId!, row.date, column.columnId, navigation)
            rowModal.current?.toggleModal()
          }}
        />)
      }

      // User (somehow) does not exisit in database
      if (type == "INLINE" || user?.role != "ADMIN") return <Text>Unbekanntes Mitglied</Text>;

      return (<BoardAssignButton
        type="EXIT"
        actionType="CROSS"
        text="Unbekanntes Mitglied"
        onPress={() => {
          unassignUser(user?.userId!, row.date, column.columnId, navigation)
          rowModal.current?.toggleModal()
        }}
      />)
    }

    // Nobody is assigned
    if (
      row.assignments
        .filter((assignment) => assignment.type == "POSITION")
        .map((assignment) => assignment.value)
        .includes(user?.userId!)
    ) {
      if (type == "INLINE") return <Text>-</Text>;

      return (<BoardAssignButton
        type="EXIT"
        text="Ebenfalls teilnehmen"
        onPress={() => {
          assignUser(user?.userId!, row.date, column.columnId, navigation)
          rowModal.current?.toggleModal()
        }}
      />)
    }

    return (
      <BoardAssignButton
        type="JOIN"
        onPress={() =>
          assignUser(user?.userId!, row.date, column.columnId, navigation)
        }
      />
    );
  }

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

  const getColsForPageAndType = (page: string, type: ColumnType) => {
    return allColumns.filter(
      (col) =>
        col.pages.includes("page_" + page) &&
        col.type == type
    )
  }

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
            {getColsForPageAndType(currentPage, "POSITION").map((col) => (
              <TD
                key={col.columnId}
                style={tw`justify-center`}
                cols={titles.length}
              >
                {getPositionForField(col, row, "INLINE")}
              </TD>
            ))}
            {getColsForPageAndType(currentPage, "COMMENT").map((col) => (
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

        <View style={tw`px-2`}>
          {/* Display all pages, sort the currentPage to first */}
          {/* TODO: In the future, it should be checked if the user has the permission to see that page/segment */}
          {renderdAllPages.map(page => (
            <View key={page.pageId}>
              <Divider type="HORIZONTAL" style={tw`my-1`} />
              <Text style={tw`text-lg `}>{page.name}:</Text>

              {getColsForPageAndType(page.pageId, "POSITION").map((col) => (
                <View
                  key={col.columnId}
                  style={tw`flex-row gap-4 py-1 items-center`}
                >
                  <Text>{col.name}</Text>{selectedRow ? getPositionForField(col, selectedRow, "MODAL") : null}
                </View>
              ))}
              {getColsForPageAndType(page.pageId, "COMMENT").map((col) => (
                <View
                  key={col.columnId}
                >
                  <Text>{col.name}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default BoardList;
