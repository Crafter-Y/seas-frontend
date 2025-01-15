import { Pressable, View } from "react-native";
import tw from "@/tailwind";
import React, { useEffect, useState } from "react";
import { Store } from "@/helpers/store";
import Divider from "@/components/elements/Divider";
import useAllPages from "@/hooks/api/useAllPages";
import useAllColumns from "@/hooks/api/useAllColumns";
import useAuthentication from "@/hooks/api/useAuthentication";
import BoardAssignButton from "@/components/board/BoardAssignButton";
import useUnAssignUser from "@/hooks/api/useUnAssignUser";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import useAssignUser from "@/hooks/api/useAssignUser";
import useSingleBoardEntry from "@/hooks/api/useSingleBoardEntry";
import CustomText from "../elements/CustomText";

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
  const [renderdAllPages, setRenderdAllPages] = useState<APIResponsePage[]>([]);

  const { allPages } = useAllPages();
  const { user } = useAuthentication();

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
  }, [assignmentSuccessful]);

  useEffect(() => {
    if (unassignmentSuccessful) querySingleRow(selectedRow!.date);
  }, [unassignmentSuccessful]);

  useEffect(() => {
    setRenderdAllPages(
      JSON.parse(JSON.stringify(allPages)).sort((a: APIResponsePage) =>
        a.id != currentPage ? 1 : -1
      )
    );
  }, [allPages, currentPage]);

  const getColsForPageAndType = (page: number, type: ColumnType) => {
    return allColumns.filter(
      (col) => col.pages.includes(page) && col.type == type
    );
  };

  const getCommentForField = (
    column: APIResponseColumn,
    page: APIResponsePage
  ) => {
    const commentExist =
      selectedRow?.comments.filter((row_) => row_.boardColumnId == column.id)
        .length == 1;

    if (commentExist) {
      const value = selectedRow?.comments.filter(
        (row_) => row_.boardColumnId == column.id
      )[0].text;
      return (
        <>
          <CustomText selectable={true}>{value}</CustomText>
          {/* TODO: check for permission if user is allowed to edit the comment field */}

          {(user?.role == "ADMIN" || user?.id == page.moderatorUserId) && (
            <BoardAssignButton
              style={tw`ml-2`}
              color="BLUE"
              text="Kommentar bearbeiten"
              onPress={() => {
                setSelectedColumn(column);
                setCommentEditValue(value || "");
                closeModal?.();
                openEditCommentModal?.();
              }}
            />
          )}
        </>
      );
    }
    if (user?.role == "ADMIN" || user?.id == page.moderatorUserId) {
      return (
        <BoardAssignButton
          color="BLUE"
          text="Kommentar hinzufügen"
          onPress={() => {
            setSelectedColumn(column);
            setCommentEditValue("");
            closeModal?.();
            openEditCommentModal?.();
          }}
        />
      );
    }
  };

  const getPositionForField = (
    column: APIResponseColumn,
    page: APIResponsePage
  ) => {
    const positionUsed =
      selectedRow?.assignments.filter((row_) => row_.boardColumnId == column.id)
        .length == 1;

    if (positionUsed) {
      const assignment = selectedRow?.assignments.filter(
        (row_) => row_.boardColumnId == column.id
      )[0];
      const usersWithCol = allExistingUsers.filter(
        (user) => user.id == assignment?.userId
      );

      // The user exists
      if (usersWithCol.length == 1) {
        // This is the current user
        if (usersWithCol[0].id == user?.id) {
          return (
            <BoardAssignButton
              color="RED"
              actionType="CROSS"
              text="Nicht mehr teilnehmen"
              onPress={() => {
                unassignUser(assignment!.id);
              }}
            />
          );
        }

        // the assignment is another known user
        if (user?.role != "ADMIN" && user?.id != page.moderatorUserId)
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
            onPress={() => {
              unassignUser(assignment!.id);
            }}
          />
        );
      }

      // User (somehow) does not exisit in database
      if (user?.role != "ADMIN" && user?.id != page.moderatorUserId)
        return <CustomText>Unbekanntes Mitglied</CustomText>;

      return (
        <BoardAssignButton
          color="RED"
          actionType="CROSS"
          text="Unbekanntes Mitglied"
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
          {(user?.role == "ADMIN" || user?.id == page.moderatorUserId) && (
            <BoardAssignButton
              color="GREEN"
              text="Mitglied eintragen"
              onPress={() => {
                setSelectedColumn(column);
                closeModal?.();
                openSelectOtherUserModal?.();
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
        {(user?.role == "ADMIN" || user?.id == page.moderatorUserId) && (
          <BoardAssignButton
            color="GREEN"
            text="Mitglied eintragen"
            onPress={() => {
              setSelectedColumn(column);
              closeModal?.();
              openSelectOtherUserModal?.();
            }}
          />
        )}
      </>
    );
  };
  return (
    <>
      <View style={tw`px-2`}>
        {/* Display all pages, sort the currentPage to first */}
        {/* TODO: In the future, it should be checked if the user has the permission to see that page/segment */}
        {renderdAllPages.map((page) => (
          <View key={page.id}>
            <CustomText style={tw`text-lg`}>{page.name}:</CustomText>

            {getColsForPageAndType(page.id, "POSITION").map((col) => (
              <View
                key={col.id}
                style={tw`flex-row py-1 items-center gap-2 flex-wrap`}
              >
                <CustomText style={tw`mr-4`}>{col.name}</CustomText>
                {selectedRow ? getPositionForField(col, page) : null}
              </View>
            ))}
            {getColsForPageAndType(page.id, "COMMENT").map((col) => (
              <View key={col.id} style={tw`py-1`}>
                <CustomText style={tw`mr-4`}>{col.name}:</CustomText>
                <View style={tw`flex-row mt-1 flex-wrap`}>
                  <Divider type="VERTICAL" style={tw`mr-1`} />
                  {selectedRow ? getCommentForField(col, page) : null}
                </View>
              </View>
            ))}
            <Divider type="HORIZONTAL" style={tw`my-1`} />
          </View>
        ))}

        {user?.role == "ADMIN" && (
          <>
            <Pressable
              style={tw`py-3`}
              onPress={() => {
                closeModal?.();
                openDeleteRowModal?.();
              }}
            >
              <CustomText style={tw`text-lg text-red-500 font-semibold`}>
                Termin löschen
              </CustomText>
            </Pressable>
            <Divider type="HORIZONTAL" style={tw`mb-1`} />
          </>
        )}
      </View>
    </>
  );
}
