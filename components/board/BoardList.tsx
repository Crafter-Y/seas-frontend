import { Text, View } from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import { prettyDate } from "@/helpers/format";
import Form from "@/components/elements/Form";
import TH from "../elements/TH";
import useAllColumns from "@/hooks/api/useAllColumns";
import TD from "../elements/TD";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import PressableTR from "../elements/PressableTR";
import useAuthentication from "@/hooks/api/useAuthentication";
import BoardAssignButton from "./BoardAssignButton";
import useAssignUser from "@/hooks/api/useAssignUser";
import { Store } from "@/helpers/store";
import ModalRewrite, { ModalHandle } from "../elements/ModalRewrite";
import BoardRowModal from "./BoardRowModal";
import BoardRowDeleteModal from "./BoardRowDeleteModal";
import BoardRowAssignOtherModal from "./BoardRowAssignOtherModal";
import BoardRowCommentModal from "./BoardRowCommentModal";

type Props = {
  rows: BoardRow[];
  fetchData: () => void;
};
const BoardList = ({ rows, fetchData }: Props) => {
  const { user } = useAuthentication();
  const { assignUser, assignmentSuccessful } = useAssignUser();
  const { allColumns } = useAllColumns();
  const { allExistingUsers } = useAllExistingUsers();

  const { isSm } = useMediaQueries();

  const { currentPage, selectedRow } = Store.useState((state) => ({
    currentPage: state.currentPage,
    selectedRow: state.selectedRow,
  }));

  const [titles, setTitles] = useState<string[]>([]);

  const [selectedColumn, setSelectedColumn] = useState<APIResponseColumn>();
  const [commentEditValue, setCommentEditValue] = useState("");

  const rowModal = useRef<ModalHandle>(null);
  const deleteEventModal = useRef<ModalHandle>(null);
  const selectUserModal = useRef<ModalHandle>(null);
  const editCommentModal = useRef<ModalHandle>(null);

  // since board actions are now in modals instead of screens, this part is no longer needed - hopefully
  // const possiblyNeedReload = useRef(false);
  // const segments = useSegments();

  // useEffect(() => {
  //   // refetch the board data, if the user comes to the board and not from a module (most likely closing the row module after an assignment)
  //   // TODO: since the rewrite to new modal, this does no longer work
  //   if (segments.length > 0 && segments[0] == "modules") {
  //     possiblyNeedReload.current = false;
  //   } else if (!possiblyNeedReload.current) {
  //     possiblyNeedReload.current = true;
  //   } else {
  //     if (segments.length == 1 && segments[0] == "board") fetchData();
  //   }

  //   // disabling scroll for web, if we are in a modal
  //   if (Platform.OS == "web") {
  //     if (
  //       segments.length > 1 &&
  //       (segments[1] == "row" || segments[0] == "modules")
  //     ) {
  //       document.body.style.overflow = "hidden";
  //       window.scrollTo(0, 0);
  //     } else {
  //       document.body.style.overflow = "";
  //     }
  //   }
  // }, [segments, possiblyNeedReload]);

  useEffect(() => {
    if (assignmentSuccessful) fetchData();
  }, [assignmentSuccessful]);

  const getCommentForField = (column: APIResponseColumn, date: string) => {
    const row = rows.filter((row_) => row_.date == date)[0];
    if (!row) return;
    const commentExist =
      row.comments.filter((row_) => row_.boardColumnId == column.id).length ==
      1;

    if (commentExist) {
      const value = row.comments.filter(
        (row_) => row_.boardColumnId == column.id
      )[0].text;
      return <Text>{value}</Text>;
    }

    return <Text>-</Text>;
  };

  const getPositionForField = (column: APIResponseColumn, date: string) => {
    const row = rows.filter((row_) => row_.date == date)[0];
    if (!user) return;
    if (!row) return;
    const positionUsed =
      row.assignments.filter((row_) => row_.boardColumnId == column.id)
        .length == 1;

    if (positionUsed) {
      const assignment = row.assignments.filter(
        (row_) => row_.boardColumnId == column.id
      )[0];
      const usersWithCol = allExistingUsers.filter(
        (user) => user.id == assignment.userId
      );

      // The user exists
      if (usersWithCol.length == 1) {
        // This is the current user
        if (usersWithCol[0].id == user?.id) {
          // underlined name for the inline view
          return (
            <Text style={tw`font-semibold underline`}>
              {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
            </Text>
          );
        }

        // the assignment is another known user
        return (
          <Text>
            {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          </Text>
        );
      }

      // User (somehow) does not exisit in database
      return <Text>Unbekanntes Mitglied</Text>;
    }

    // Nobody is assigned
    if (
      row.assignments.map((assignment) => assignment.userId).includes(user!.id)
    ) {
      return <Text>-</Text>;
    }

    return (
      <BoardAssignButton
        color="GREEN"
        onPress={() => {
          // this timeout is needed, because on e.g. chrome mobile, the press event is passed down to the board row pressable
          // without this, the board row modal will also open on press of this button
          setTimeout(() => {
            assignUser(user!.id, row.date, column.id);
          }, 100);
        }}
      />
    );
  };

  useEffect(() => {
    const titles = [];
    titles.push("Termin");

    allColumns.forEach((column) => {
      if (column.pages.includes(currentPage) && column.type == "POSITION") {
        titles.push(column.name);
      }
    });
    allColumns.forEach((column) => {
      if (column.pages.includes(currentPage) && column.type == "COMMENT") {
        titles.push(column.name);
      }
    });
    setTitles(titles);
  }, [currentPage, allColumns]);

  const getColsForPageAndType = (page: number, type: ColumnType) => {
    return allColumns.filter(
      (col) => col.pages.includes(page) && col.type == type
    );
  };

  return (
    <View
      style={tw.style({
        "px-0": !isSm,
        "px-6": isSm,
      })}
    >
      <Form style={tw`mb-4 bg-white`}>
        <TH titles={titles} />
        {rows.map((row) => (
          <PressableTR
            key={row.date}
            date={row.date}
            onPress={() => {
              Store.update((state) => {
                state.selectedRow = row;
              });
              rowModal.current?.openModal();
            }}
          >
            <TD style={tw`justify-center`} cols={titles.length}>
              <Text>{prettyDate(row.date, !isSm)}</Text>
            </TD>
            {getColsForPageAndType(currentPage, "POSITION").map((col) => (
              <TD key={col.id} style={tw`justify-center`} cols={titles.length}>
                {getPositionForField(col, row.date)}
              </TD>
            ))}
            {getColsForPageAndType(currentPage, "COMMENT").map((col) => (
              <TD key={col.id} style={tw`justify-center`} cols={titles.length}>
                {getCommentForField(col, row.date)}
              </TD>
            ))}
          </PressableTR>
        ))}
      </Form>
      <ModalRewrite
        title={
          selectedRow ? prettyDate(selectedRow?.date as string, false) : ""
        }
        ref={rowModal}
        scrollable
      >
        <BoardRowModal
          closeModal={rowModal.current?.closeModal}
          openDeleteRowModal={deleteEventModal.current?.openModal}
          openSelectOtherUserModal={selectUserModal.current?.openModal}
          openEditCommentModal={editCommentModal.current?.openModal}
          triggerBoardRefetch={fetchData}
          setSelectedColumn={setSelectedColumn}
          setCommentEditValue={setCommentEditValue}
        />
      </ModalRewrite>
      <ModalRewrite title="Termin löschen" ref={deleteEventModal}>
        <BoardRowDeleteModal
          closeModal={deleteEventModal.current?.closeModal}
          openRowModal={rowModal.current?.openModal}
          selectedRow={selectedRow}
          triggerBoardRefetch={fetchData}
        />
      </ModalRewrite>
      <ModalRewrite title="Mitglied auswählen" ref={selectUserModal} scrollable>
        <BoardRowAssignOtherModal
          closeModal={selectUserModal.current?.closeModal}
          selectedColumn={selectedColumn}
        />
      </ModalRewrite>
      <ModalRewrite
        title="Kommentar anpassen"
        ref={editCommentModal}
        scrollable
      >
        <BoardRowCommentModal
          closeModal={editCommentModal.current?.closeModal}
          openRowModal={rowModal.current?.openModal}
          setCommentEditValue={setCommentEditValue}
          commentEditValue={commentEditValue}
          selectedColumn={selectedColumn}
          triggerBoardRefetch={fetchData}
        />
      </ModalRewrite>
    </View>
  );
};

export default memo(BoardList);
