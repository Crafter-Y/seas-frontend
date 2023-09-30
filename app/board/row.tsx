import { Pressable, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import tw from "@/tailwind";
import CenterModal from "@/components/elements/CenterModal";
import { prettyDate } from "@/helpers/format";
import { useEffect, useRef, useState } from "react";
import { Store } from "@/helpers/store";
import Divider from "@/components/elements/Divider";
import useAllPages from "@/hooks/api/useAllPages";
import useAllColumns from "@/hooks/api/useAllColumns";
import useAuthentication from "@/hooks/api/useAuthentication";
import BoardAssignButton from "@/components/BoardAssignButton";
import useUnAssignUser from "@/hooks/api/useUnAssignUser";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import useAssignUser from "@/hooks/api/useAssignUser";
import useSingleBoardEntry from "@/hooks/api/useSingleBoardEntry";
import RNNModal, { ModalHandle } from "@/components/elements/Modal";
import H1 from "@/components/elements/H1";
import Button from "@/components/elements/Button";
import useDeleteEvent from "@/hooks/api/useDeleteEvent";
import { Color } from "@/helpers/Constants";
import useMediaQueries from "@/hooks/useMediaQueries";
import useAllDefaultComments from "@/hooks/api/useAllDefaultComments";
import useUpdateComment from "@/hooks/api/useUpdateComment";

export default function Modal() {
  const { isSm } = useMediaQueries();
  const { date } = useLocalSearchParams();

  const [renderdAllPages, setRenderdAllPages] = useState<APIResponsePage[]>([]);

  const { allPages } = useAllPages();
  const { user } = useAuthentication();
  const { allDefaultComments } = useAllDefaultComments();

  const { selectedRow, querySingleRow } = useSingleBoardEntry();

  const { currentPage } = Store.useState(state => ({
    currentPage: state.currentPage
  }));

  const { allColumns } = useAllColumns();
  const { allExistingUsers } = useAllExistingUsers();

  const { deleteEvent, succesfulDeletion } = useDeleteEvent();

  const { assignUser, assignmentSuccessful } = useAssignUser();
  const { unassignUser, unassignmentSuccessful } = useUnAssignUser();

  const { updateComment, successfulUpdate } = useUpdateComment();

  const deleteEventModal = useRef<ModalHandle>(null);
  const selectUserModal = useRef<ModalHandle>(null);
  const editCommentModal = useRef<ModalHandle>(null);

  const [selectedColumn, setSelectedColumn] = useState<APIResponseColumn>();
  const [commentEditValue, setCommentEditValue] = useState("");

  useEffect(() => {
    if (assignmentSuccessful || unassignmentSuccessful) querySingleRow(selectedRow!.date);
  }, [assignmentSuccessful, unassignmentSuccessful]);

  useEffect(() => {
    setRenderdAllPages(JSON.parse(JSON.stringify(allPages)).sort((a: APIResponsePage) => a.id != currentPage ? 1 : -1));
  }, [allPages, currentPage]);

  useEffect(() => {
    if (succesfulDeletion) {
      deleteEventModal.current?.toggleModal();
      Store.update(state => { state.selectedRow = undefined; });

      router.back();
    }
  }, [succesfulDeletion]);

  useEffect(() => {
    if (successfulUpdate) {
      querySingleRow(selectedRow!.date);
      editCommentModal.current?.toggleModal();
    }
  }, [successfulUpdate]);

  const getColsForPageAndType = (page: number, type: ColumnType) => {
    return allColumns.filter(
      (col) =>
        col.pages.includes(page) &&
                col.type == type
    );
  };

  const getCommentForField = (column: APIResponseColumn) => {
    const commentExist =
            selectedRow?.comments.filter((row_) => row_.boardColumnId == column.id)
              .length == 1;

    if (commentExist) {
      const value = selectedRow?.comments.filter(
        (row_) => row_.boardColumnId == column.id
      )[0].text;
      return (<>
        <Text>{value}</Text>
        {/* TODO: check for permission if user is allowed to edit the comment field */}
        <BoardAssignButton
          style={tw`ml-2`}
          color="BLUE"
          text="Kommentar bearbeiten"
          onPress={() => {
            editCommentModal.current?.toggleModal();
            setSelectedColumn(column);
            setCommentEditValue(value || "");
          }}
        />
      </>);
    }

    return (<BoardAssignButton
      color="BLUE"
      text="Kommentar hinzufügen"
      onPress={() => {
        editCommentModal.current?.toggleModal();
        setSelectedColumn(column);
        setCommentEditValue("");
      }}
    />);
  };

  const getPositionForField = (column: APIResponseColumn) => {
    const positionUsed =
            selectedRow?.assignments.filter((row_) => row_.boardColumnId == column.id)
              .length == 1;

    if (positionUsed) {
      const assignment = selectedRow?.assignments.filter((row_) => row_.boardColumnId == column.id)[0];
      const usersWithCol = allExistingUsers.filter((user) => user.id == assignment?.userId);

      // The user exists
      if (usersWithCol.length == 1) {
        // This is the current user
        if (usersWithCol[0].id == user?.id) {
          return (<BoardAssignButton
            color="RED"
            actionType="CROSS"
            text="Nicht mehr teilnehmen"
            onPress={() => {
              unassignUser(assignment!.id);
            }}
          />);
        }

        // the assignment is another known user
        if (user?.role != "ADMIN") return (
          <Text>
            {usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          </Text>
        );

        return (<BoardAssignButton
          color="RED"
          actionType="CROSS"
          text={usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          onPress={() => {
            unassignUser(assignment!.id);
          }}
        />);
      }

      // User (somehow) does not exisit in database
      if (user?.role != "ADMIN") return <Text>Unbekanntes Mitglied</Text>;

      return (<BoardAssignButton
        color="RED"
        actionType="CROSS"
        text="Unbekanntes Mitglied"
        onPress={() => {
          unassignUser(assignment!.id);
        }}
      />);
    }

    // Nobody is assigned
    if (
      selectedRow?.assignments
        .map((assignment) => assignment.userId)
        .includes(user!.id)
    ) {
      return (<>
        <BoardAssignButton
          color="YELLOW"
          text="Ebenfalls teilnehmen"
          onPress={() => {
            assignUser(user!.id, selectedRow!.date, column.id);
          }}
        />
        {user?.role == "ADMIN" && (
          <BoardAssignButton
            color="GREEN"
            text="Mitglied eintragen"
            onPress={() => {
              setSelectedColumn(column);
              selectUserModal.current?.toggleModal();
            }}
          />
        )}
      </>);
    }

    return (
      <>
        <BoardAssignButton
          color="GREEN"
          text="Teilnehmen"
          onPress={() =>
            assignUser(user!.id, selectedRow!.date, column.id)
          }
        />
        {user?.role == "ADMIN" && (
          <BoardAssignButton
            color="GREEN"
            text="Mitglied eintragen"
            onPress={() => {
              setSelectedColumn(column);
              selectUserModal.current?.toggleModal();
            }}
          />
        )}
      </>
    );
  };

  return (
    <CenterModal>
      <Text style={tw`text-center text-2xl underline my-2 font-semibold`}>{prettyDate(date as string, false)}</Text>

      <View style={tw`px-2`}>
        {/* Display all pages, sort the currentPage to first */}
        {/* TODO: In the future, it should be checked if the user has the permission to see that page/segment */}
        {renderdAllPages.map(page => (
          <View key={page.id}>
            <Divider type="HORIZONTAL" style={tw`my-1`} />
            <Text style={tw`text-lg`}>{page.name}:</Text>

            {getColsForPageAndType(page.id, "POSITION").map((col) => (
              <View
                key={col.id}
                style={tw`flex-row py-1 items-center gap-2`}
              >
                <Text style={tw`mr-4`}>{col.name}</Text>
                {selectedRow ? getPositionForField(col) : null}
              </View>
            ))}
            {getColsForPageAndType(page.id, "COMMENT").map((col) => (
              <View
                key={col.id}
                style={tw`py-1`}
              >
                <Text style={tw`mr-4`}>{col.name}:</Text>
                <View style={tw`flex-row mt-1 flex-wrap`}>
                  <Divider type="VERTICAL" style={tw`mr-1`} />
                  {selectedRow ? getCommentForField(col) : null}
                </View>
              </View>
            ))}
          </View>
        ))}

        {user?.role == "ADMIN" && (
          <>
            <Divider type="HORIZONTAL" style={tw`mt-1`} />
            <Pressable style={tw`py-3`} onPress={() => {
              deleteEventModal.current?.toggleModal();
            }}>
              <Text style={tw`text-lg text-red-500 font-semibold`}>Termin löschen</Text>
            </Pressable>
            <Divider type="HORIZONTAL" style={tw`mb-1`} />
          </>
        )}
      </View>

      <RNNModal type="CENTER" ref={deleteEventModal}>
        <H1 style={tw`mt-2 text-center`}>Termin löschen?</H1>
        <Text style={tw`mx-4`}>
                    Soll der Termin{" "}
          <Text style={tw`font-semibold`}>{selectedRow ? prettyDate(selectedRow.date, false) : ""}</Text> wirklich
                    glöscht werden?
        </Text>
        <Text style={tw`text-red-400 mx-4 mt-2`}>
                    Dadurch werden <Text style={tw`font-semibold`}>alle</Text> Eintragungen von Mitgliedern, sowie die Kommentare gelöscht.
                    Dies kann nicht mehr Rückgängig gemacht werden!
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteEvent(selectedRow!.date);
            }}
            color="#f67e7e"
          >
                        Löschen
          </Button>
          <Button onPress={() => deleteEventModal.current?.toggleModal()}>
                        Abbrechen
          </Button>
        </View>
      </RNNModal>


      <RNNModal type="CENTER" ref={selectUserModal}>
        <Text style={tw`text-center text-2xl underline my-2 font-semibold`}>Mitglied auswählen</Text>
        <View style={tw`flex-row flex-wrap px-2`}>
          {allExistingUsers.filter(user_ => user_.firstname != "root").filter(user_ => !user_.deleted).map(extUser => (
            <View key={extUser.id} style={tw`px-2 py-1`}>
              <BoardAssignButton
                color="GREEN"
                text={extUser.firstname + " " + extUser.lastname}
                onPress={() => {
                  assignUser(extUser.id, selectedRow!.date, selectedColumn!.id);
                  selectUserModal.current?.toggleModal();
                }}
              />
            </View>
          ))}
        </View>
      </RNNModal>

      <RNNModal type="CENTER" ref={editCommentModal}>
        <View style={tw.style({
          "px-6": isSm,
          "px-4": !isSm
        }, "py-6")}>
          <Text style={tw`font-bold text-lg`}>Kommentar anpassen</Text>
          <Pressable>
            <TextInput
              multiline
              editable
              numberOfLines={4}
              style={tw`border rounded-lg border-gray-400 px-2 py-1 opacity-85 text-lg`}
              placeholder="Kommentar eingeben"
              value={commentEditValue}
              onChangeText={setCommentEditValue}
            />
          </Pressable>

          <View style={tw`flex-row flex-wrap gap-1 mt-1`}>
            {allDefaultComments?.map(comment => (
              <Pressable key={comment.id} style={tw`border border-gray-400 rounded-lg py-1 px-2 flex-row items-center gap-2`} onPress={() => {
                setCommentEditValue(commentEditValue + comment.comment);
              }}>
                <Text style={tw`font-semibold text-green-500 text-lg`} selectable={false}>+</Text>
                <Text style={tw`font-semibold`} selectable={false}>{comment.comment}</Text>
              </Pressable>
            ))}
          </View>

          <View style={tw`justify-center flex-row gap-2 my-4`}>
            <Button onPress={() => editCommentModal.current?.toggleModal()}>
                            Abbrechen
            </Button>
            <Button
              onPress={() => {
                updateComment(selectedRow!.date, selectedColumn!.id, commentEditValue);
              }}
              color={Color.GREEN}
            >
                            Speichern
            </Button>
          </View>
        </View>
      </RNNModal>
    </CenterModal>
  );
}
