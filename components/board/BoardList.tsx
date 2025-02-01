import React, { memo, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import BoardAssignButton from "@/components/board/BoardAssignButton";
import BoardRowCommentModal from "@/components/board/BoardRowCommentModal";
import BoardRowDeleteModal from "@/components/board/BoardRowDeleteModal";
import BoardRowModal from "@/components/board/BoardRowModal";
import CustomText from "@/components/elements/CustomText";
import Form from "@/components/elements/Form";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import PressableTR from "@/components/elements/PressableTR";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import UserSelectModal from "@/components/elements/UserSelectModal";
import { prettyDate } from "@/helpers/format";
import { Store } from "@/helpers/store";
import useAllColumns from "@/hooks/api/useAllColumns";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import useAssignUser from "@/hooks/api/useAssignUser";
import useAuthentication from "@/hooks/api/useAuthentication";
import useSingleBoardEntry from "@/hooks/api/useSingleBoardEntry";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";

type Props = {
  rows: BoardRow[];
  fetchData: () => void;
};
const BoardList = ({ rows, fetchData }: Props) => {
  const { user } = useAuthentication();
  const { assignUser, assignmentSuccessful } = useAssignUser();
  const {
    assignUser: boardAssign,
    assignmentSuccessful: boardAssignSuccessful,
  } = useAssignUser();
  const { allColumns } = useAllColumns();
  const { allExistingUsers } = useAllExistingUsers();
  const { selectedRow, querySingleRow } = useSingleBoardEntry();

  const { isSm } = useMediaQueries();

  const { currentPage } = Store.useState((state) => ({
    currentPage: state.currentPage,
  }));

  const [titles, setTitles] = useState<string[]>([]);

  const [selectedColumn, setSelectedColumn] = useState<APIResponseColumn>();
  const [commentEditValue, setCommentEditValue] = useState("");

  const rowModal = useRef<ModalHandle>(null);
  const deleteEventModal = useRef<ModalHandle>(null);
  const selectUserModal = useRef<ModalHandle>(null);
  const editCommentModal = useRef<ModalHandle>(null);

  useEffect(() => {
    if (boardAssignSuccessful) {
      fetchData();
    }
  }, [boardAssignSuccessful]);

  useEffect(() => {
    if (assignmentSuccessful) {
      querySingleRow(selectedRow!.date);
    }
  }, [assignmentSuccessful, selectedRow]);

  const getCommentForField = (column: APIResponseColumn, date: string) => {
    const row = rows.filter((row_) => row_.date === date)[0];
    if (!row) return;
    const commentExist =
      row.comments.filter((row_) => row_.boardColumnId === column.id).length ===
      1;

    if (commentExist) {
      const value = row.comments.filter(
        (row_) => row_.boardColumnId === column.id,
      )[0].text;
      return <CustomText>{value}</CustomText>;
    }

    return <CustomText>-</CustomText>;
  };

  const getPositionForField = (column: APIResponseColumn, date: string) => {
    const row = rows.filter((row_) => row_.date === date)[0];
    if (!user) return;
    if (!row) return;
    const positionUsed =
      row.assignments.filter((row_) => row_.boardColumnId === column.id)
        .length === 1;

    if (positionUsed) {
      const assignment = row.assignments.filter(
        (row_) => row_.boardColumnId === column.id,
      )[0];
      const usersWithCol = allExistingUsers.filter(
        (user) => user.id === assignment.userId,
      );

      // The user exists
      if (usersWithCol.length === 1) {
        // This is the current user
        if (usersWithCol[0].id === user?.id) {
          // underlined name for the inline view
          return (
            <CustomText style={tw`font-semibold underline`}>
              {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
            </CustomText>
          );
        }

        // the assignment is another known user
        return (
          <CustomText>
            {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          </CustomText>
        );
      }

      // User (somehow) does not exisit in database
      return <CustomText>Unbekanntes Mitglied</CustomText>;
    }

    // Nobody is assigned
    if (
      row.assignments.map((assignment) => assignment.userId).includes(user!.id)
    ) {
      return <CustomText>-</CustomText>;
    }

    return (
      <BoardAssignButton
        color="GREEN"
        onPress={() => {
          // this timeout is needed, because on e.g. chrome mobile, the press event is passed down to the board row pressable
          // without this, the board row modal will also open on press of this button
          setTimeout(() => {
            boardAssign(user!.id, row.date, column.id);
          }, 100);
        }}
      />
    );
  };

  useEffect(() => {
    const titles = [];
    titles.push("Termin");

    allColumns.forEach((column) => {
      if (column.pages.includes(currentPage) && column.type === "POSITION") {
        titles.push(column.name);
      }
    });
    allColumns.forEach((column) => {
      if (column.pages.includes(currentPage) && column.type === "COMMENT") {
        titles.push(column.name);
      }
    });
    setTitles(titles);
  }, [currentPage, allColumns]);

  const getColsForPageAndType = (page: number, type: ColumnType) => {
    return allColumns.filter(
      (col) => col.pages.includes(page) && col.type === type,
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
              <CustomText>{prettyDate(row.date, !isSm)}</CustomText>
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
        title="literal"
        values={{
          text: selectedRow
            ? prettyDate(selectedRow?.date as string, false)
            : "",
        }}
        ref={rowModal}
        scrollable
      >
        <BoardRowModal
          closeModal={() => rowModal.current!.closeModal()}
          openDeleteRowModal={() => deleteEventModal.current!.openModal()}
          openSelectOtherUserModal={() => selectUserModal.current!.openModal()}
          openEditCommentModal={() => editCommentModal.current!.openModal()}
          triggerBoardRefetch={fetchData}
          setSelectedColumn={setSelectedColumn}
          setCommentEditValue={setCommentEditValue}
        />
      </ModalRewrite>
      <ModalRewrite title="modal.board.deleteEvent" ref={deleteEventModal}>
        <BoardRowDeleteModal
          closeModal={() => deleteEventModal.current?.closeModal()}
          openRowModal={() => rowModal.current?.openModal()}
          selectedRow={selectedRow}
          triggerBoardRefetch={fetchData}
        />
      </ModalRewrite>
      <ModalRewrite
        title="modal.board.selectUser"
        ref={selectUserModal}
        scrollable
      >
        <UserSelectModal
          initialSelectedUserId={null}
          closeModal={() => {
            selectUserModal.current?.closeModal();
            rowModal.current?.openModal();
          }}
          onUserSet={(userId) =>
            userId
              ? assignUser(userId, selectedRow!.date, selectedColumn!.id)
              : () => {}
          }
          allUsers={Array.from(allExistingUsers).filter(
            (user) => !user.deleted,
          )}
        />
      </ModalRewrite>
      <ModalRewrite
        title="modal.board.editComment"
        ref={editCommentModal}
        scrollable
      >
        <BoardRowCommentModal
          closeModal={() => editCommentModal.current?.closeModal()}
          openRowModal={() => rowModal.current?.openModal()}
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
