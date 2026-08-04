import React, { useContext, useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";

import BoardAssignButton from "@/components/board/BoardAssignButton";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import { AppContext } from "@/helpers/appContext";
import { Store } from "@/helpers/store";
import useAllColumns from "@/hooks/api/useAllColumns";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import useAllPages from "@/hooks/api/useAllPages";
import useAssignUser from "@/hooks/api/useAssignUser";
import useSingleBoardEntry from "@/hooks/api/useSingleBoardEntry";
import useUnAssignUser from "@/hooks/api/useUnAssignUser";

type Props = {
  closeModal: () => void;
  openDeleteRowModal: () => void;
  triggerBoardRefetch: () => void;
  openSelectOtherUserModal: () => void;
  openEditCommentModal: () => void;
  selectedColumn?: APIResponseColumn;
  setSelectedColumn: (col: APIResponseColumn) => void;
  setCommentEditValue: (val: string) => void;
};

export default function BoardRowModal({
  closeModal,
  openDeleteRowModal,
  openSelectOtherUserModal,
  setSelectedColumn,
  openEditCommentModal,
  setCommentEditValue,
}: Props) {
  const { allPages } = useAllPages();
  const { user } = useContext(AppContext);

  const { selectedRow, querySingleRow } = useSingleBoardEntry();

  const { currentPage } = Store.useState((state) => ({
    currentPage: state.currentPage,
  }));

  const { allColumns } = useAllColumns();
  const { allExistingUsers } = useAllExistingUsers();

  const { assignUser, assignmentSuccessful } = useAssignUser();
  const { unassignUser, unassignmentSuccessful } = useUnAssignUser();

  useEffect(() => {
    if (assignmentSuccessful) querySingleRow(selectedRow!.date);
    // TODO: including querySingleRow and selectedRow causes multiple invokations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentSuccessful]);

  useEffect(() => {
    if (unassignmentSuccessful) {
      querySingleRow(selectedRow!.date);
    }
    // TODO: including querySingleRow and selectedRow causes multiple invokations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignmentSuccessful]);

  useEffect(() => {
    // this is needed, becase the board assignment creates an random id before the actual assignment id is loaded.
    // in this case, the unassignment would not work. To solve this, I requery the selected board row incase the id is larger then 1000000
    // TODO: instead of this, the actual assignment ID could be return from the assign user endpoint and then immediately set before the whole board refetch.
    if (
      selectedRow!.assignments.filter((assignment) => assignment.id > 1_000_000)
        .length !== 0
    )
      querySingleRow(selectedRow!.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderdAllPages = useMemo<APIResponsePage[]>(
    () =>
      (JSON.parse(JSON.stringify(allPages)) as APIResponsePage[]).sort((a) =>
        a.id !== currentPage ? 1 : -1,
      ),
    [allPages, currentPage],
  );

  const getColsForPageAndType = (page: number, type: ColumnType) => {
    return allColumns.filter(
      (col) => col.pages.includes(page) && col.type === type,
    );
  };

  const getCommentForField = (
    column: APIResponseColumn,
    page: APIResponsePage,
  ) => {
    const commentExist =
      selectedRow?.comments.filter((row_) => row_.boardColumnId === column.id)
        .length === 1;

    if (commentExist) {
      const value = selectedRow?.comments.filter(
        (row_) => row_.boardColumnId === column.id,
      )[0].text;
      return (
        <>
          <CustomText selectable={true}>{value}</CustomText>
          {/* TODO: check for permission if user is allowed to edit the comment field */}

          {(user?.role === "ADMIN" || user?.id === page.moderatorUserId) && (
            <BoardAssignButton
              className="ml-2 m-1"
              color="BLUE"
              text="Kommentar bearbeiten"
              onPress={() => {
                setSelectedColumn(column);
                setCommentEditValue(value || "");
                closeModal();
                openEditCommentModal();
              }}
            />
          )}
        </>
      );
    }
    if (user?.role === "ADMIN" || user?.id === page.moderatorUserId) {
      return (
        <BoardAssignButton
          color="BLUE"
          text="Kommentar hinzufügen"
          onPress={() => {
            setSelectedColumn(column);
            setCommentEditValue("");
            closeModal();
            openEditCommentModal();
          }}
        />
      );
    }
  };

  const getPositionForField = (
    column: APIResponseColumn,
    page: APIResponsePage,
  ) => {
    const positionUsed =
      selectedRow?.assignments.filter(
        (row_) => row_.boardColumnId === column.id,
      ).length === 1;

    if (positionUsed) {
      const assignment = selectedRow?.assignments.filter(
        (row_) => row_.boardColumnId === column.id,
      )[0];
      const usersWithCol = allExistingUsers.filter(
        (user) => user.id === assignment?.userId,
      );

      // The user exists
      if (usersWithCol.length === 1) {
        // This is the current user
        if (usersWithCol[0].id === user?.id) {
          return (
            <BoardAssignButton
              color="RED"
              actionType="CROSS"
              text="Nicht mehr teilnehmen"
              disabled={assignment!.id > 1_000_000}
              onPress={() => {
                unassignUser(assignment!.id);
              }}
            />
          );
        }

        // the assignment is another known user
        if (user?.role !== "ADMIN" && user?.id !== page.moderatorUserId)
          return (
            <CustomText>
              {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
            </CustomText>
          );

        return (
          <BoardAssignButton
            color="RED"
            actionType="CROSS"
            text={usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
            disabled={assignment!.id > 1_000_000}
            onPress={() => {
              unassignUser(assignment!.id);
            }}
          />
        );
      }

      // User (somehow) does not exisit in database
      if (user?.role !== "ADMIN" && user?.id !== page.moderatorUserId)
        return <CustomText>Unbekanntes Mitglied</CustomText>;

      return (
        <BoardAssignButton
          color="RED"
          actionType="CROSS"
          text="Unbekanntes Mitglied"
          disabled={assignment!.id > 1_000_000}
          onPress={() => {
            unassignUser(assignment!.id);
          }}
        />
      );
    }

    // Nobody is assigned
    if (
      selectedRow?.assignments
        .map((assignment) => assignment.userId)
        .includes(user!.id)
    ) {
      return (
        <>
          <BoardAssignButton
            color="YELLOW"
            text="Ebenfalls teilnehmen"
            onPress={() => {
              assignUser(user!.id, selectedRow!.date, column.id);
            }}
          />
          {(user?.role === "ADMIN" || user?.id === page.moderatorUserId) && (
            <BoardAssignButton
              color="GREEN"
              text="Mitglied eintragen"
              onPress={() => {
                setSelectedColumn(column);
                closeModal();
                openSelectOtherUserModal();
              }}
            />
          )}
        </>
      );
    }

    return (
      <>
        <BoardAssignButton
          color="GREEN"
          text="Teilnehmen"
          onPress={() => assignUser(user!.id, selectedRow!.date, column.id)}
        />
        {(user?.role === "ADMIN" || user?.id === page.moderatorUserId) && (
          <BoardAssignButton
            color="GREEN"
            text="Mitglied eintragen"
            onPress={() => {
              setSelectedColumn(column);
              closeModal();
              openSelectOtherUserModal();
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <View className="px-2">
        {/* Display all pages, sort the currentPage to first */}
        {/* TODO: In the future, it should be checked if the user has the permission to see that page/segment */}
        {renderdAllPages.map((page) => (
          <View key={page.id}>
            <CustomText className="text-lg">{page.name}:</CustomText>

            {getColsForPageAndType(page.id, "POSITION").map((col) => (
              <View
                key={col.id}
                className="flex-row py-1 items-center gap-2 flex-wrap"
              >
                <CustomText className="mr-4">{col.name}</CustomText>
                {selectedRow ? getPositionForField(col, page) : null}
              </View>
            ))}
            {getColsForPageAndType(page.id, "COMMENT").map((col) => (
              <View key={col.id} className="py-1">
                <CustomText className="mr-4">{col.name}:</CustomText>
                <View className="flex-row mt-1 flex-wrap">
                  <Divider type="VERTICAL" className="mr-1" />
                  {selectedRow ? getCommentForField(col, page) : null}
                </View>
              </View>
            ))}
            <Divider type="HORIZONTAL" className="my-1" />
          </View>
        ))}

        {user?.role === "ADMIN" && (
          <>
            <Pressable
              className="py-3"
              onPress={() => {
                closeModal();
                openDeleteRowModal();
              }}
            >
              <CustomText className="text-lg text-red-500 font-semibold">
                Termin löschen
              </CustomText>
            </Pressable>
            <Divider type="HORIZONTAL" className="mb-1" />
          </>
        )}
      </View>
    </>
  );
}
