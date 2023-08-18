import { View, Text, Pressable, TextInput } from "react-native";
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
import useUnAssignUser from "@/hooks/api/useUnAssignUser";
import useDeleteEvent from "@/hooks/api/useDeleteEvent";
import H1 from "./elements/H1";
import Button from "./elements/Button";
import { Color } from "@/helpers/Constants";
import useAllDefaultComments from "@/hooks/api/useAllDefaultComments";
import useUpdateComment from "@/hooks/api/useUpdateComment";

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
  const { deleteEvent, succesfulDeletion } = useDeleteEvent();
  const { allDefaultComments } = useAllDefaultComments();
  const { updateComment, successfulUpdate } = useUpdateComment();

  const [titles, setTitles] = useState<string[]>([]);

  const { user } = useAuthentication();

  const { assignUser, assignmentSuccessful } = useAssignUser();
  const { unassignUser, unassignmentSuccessful } = useUnAssignUser();

  const rowModal = useRef<ModalHandle>(null);
  const [selectedRow, setSelectedRow] = useState<BoardRow>();

  const selectUserModal = useRef<ModalHandle>(null);
  const [selectedColumn, setSelectedColumn] = useState<APIResponseColumn>();

  const deleteEventModal = useRef<ModalHandle>(null);
  const [dateToDelete, setDateToDelete] = useState("");

  const editCommentModal = useRef<ModalHandle>(null);
  const [commentEditValue, setCommentEditValue] = useState("");

  useEffect(() => {
    setRenderdAllPages(JSON.parse(JSON.stringify(allPages)).sort((a: APIResponsePage) => a.pageId != currentPage ? 1 : -1));
  }, [allPages, currentPage])

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

  useEffect(() => {
    if (successfulUpdate) {
      fetchData(dateStart, dateEnd);
      editCommentModal.current?.toggleModal()
    }
  }, [successfulUpdate])

  useEffect(() => {
    if (succesfulDeletion) {
      deleteEventModal.current?.toggleModal();
      rowModal.current?.toggleModal();
      setSelectedRow(undefined)

      fetchData(dateStart, dateEnd);
    }
  }, [succesfulDeletion])

  const fetchData = (start: Date, end: Date) => {
    queryBoard(formatDate(start), formatDate(end));
    console.log("query", start, end);
  };

  const getCommentForField = (column: APIResponseColumn, date: string, type: "INLINE" | "MODAL") => {
    let row = rows.filter(row_ => row_.date == date)[0];

    let commentExist =
      row.assignments.filter((row_) => row_.columnId == column.columnId)
        .length == 1;

    if (commentExist) {
      let value = row.assignments.filter(
        (row_) => row_.columnId == column.columnId
      )[0].value;
      return (<>
        <Text>{value}</Text>
        {(user?.role == "ADMIN" || user?.role == "MODERATOR") && type == "MODAL" && (
          <BoardAssignButton
            style={tw`ml-2`}
            color="BLUE"
            text="Kommentar bearbeiten"
            onPress={() => {
              editCommentModal.current?.toggleModal()
              setSelectedColumn(column);
              setCommentEditValue(value)
            }}
          />
        )}
      </>)
    }
    if (type == "INLINE" || (user?.role != "ADMIN" && user?.role != "MODERATOR")) return <Text>-</Text>;

    return (<BoardAssignButton
      color="BLUE"
      text="Kommentar hinzufügen"
      onPress={() => {
        editCommentModal.current?.toggleModal()
        setSelectedColumn(column);
        setCommentEditValue("")
      }}
    />)
  };

  const getPositionForField = (column: APIResponseColumn, date: string, type: "INLINE" | "MODAL") => {
    let row = rows.filter(row_ => row_.date == date)[0];
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
            color="RED"
            actionType="CROSS"
            text="Nicht mehr teilnehmen"
            onPress={() => {
              unassignUser(user?.userId!, row.date, column.columnId, navigation)
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
          color="RED"
          actionType="CROSS"
          text={usersWithCol[0].firstname + " " + usersWithCol[0].lastname}
          onPress={() => {
            unassignUser(user?.userId!, row.date, column.columnId, navigation)
          }}
        />)
      }

      // User (somehow) does not exisit in database
      if (type == "INLINE" || user?.role != "ADMIN") return <Text>Unbekanntes Mitglied</Text>;

      return (<BoardAssignButton
        color="RED"
        actionType="CROSS"
        text="Unbekanntes Mitglied"
        onPress={() => {
          unassignUser(user?.userId!, row.date, column.columnId, navigation)
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

      return (<>
        <BoardAssignButton
          color="YELLOW"
          text="Ebenfalls teilnehmen"
          onPress={() => {
            assignUser(user?.userId!, row.date, column.columnId, navigation)
          }}
        />
        {user?.role == "ADMIN" && (
          <BoardAssignButton
            color="GREEN"
            text="Mitglied eintragen"
            onPress={() => {
              setSelectedColumn(column);
              selectUserModal.current?.toggleModal()
            }}
          />
        )}
      </>)
    }

    if (type == "MODAL") {
      return (
        <>
          <BoardAssignButton
            color="GREEN"
            text="Teilnehmen"
            onPress={() =>
              assignUser(user?.userId!, row.date, column.columnId, navigation)
            }
          />
          {user?.role == "ADMIN" && (
            <BoardAssignButton
              color="GREEN"
              text="Mitglied eintragen"
              onPress={() => {
                setSelectedColumn(column);
                selectUserModal.current?.toggleModal()
              }}
            />
          )}
        </>
      );
    }

    return (
      <BoardAssignButton
        color="GREEN"
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
                {getPositionForField(col, row.date, "INLINE")}
              </TD>
            ))}
            {getColsForPageAndType(currentPage, "COMMENT").map((col) => (
              <TD
                key={col.columnId}
                style={tw`justify-center`}
                cols={titles.length}
              >
                {getCommentForField(col, row.date, "INLINE")}
              </TD>
            ))}
          </PressableTR>
        ))}
      </Form>

      <Modal type="CENTER" ref={rowModal} swipeDirection={[]}>
        <Text style={tw`text-center text-2xl underline my-2 font-semibold`}>{selectedRow ? prettyDate(selectedRow.date, false) : ""}</Text>

        <View style={tw`px-2`}>
          {/* Display all pages, sort the currentPage to first */}
          {/* TODO: In the future, it should be checked if the user has the permission to see that page/segment */}
          {renderdAllPages.map(page => (
            <View key={page.pageId}>
              <Divider type="HORIZONTAL" style={tw`my-1`} />
              <Text style={tw`text-lg`}>{page.name}:</Text>

              {getColsForPageAndType(page.pageId, "POSITION").map((col) => (
                <View
                  key={col.columnId}
                  style={tw`flex-row py-1 items-center gap-2`}
                >
                  <Text style={tw`mr-4`}>{col.name}</Text>
                  {selectedRow ? getPositionForField(col, selectedRow.date, "MODAL") : null}
                </View>
              ))}
              {getColsForPageAndType(page.pageId, "COMMENT").map((col) => (
                <View
                  key={col.columnId}
                  style={tw`py-1`}
                >
                  <Text style={tw`mr-4`}>{col.name}:</Text>
                  <View style={tw`flex-row mt-1 flex-wrap`}>
                    <Divider type="VERTICAL" style={tw`mr-1`} />
                    {selectedRow ? getCommentForField(col, selectedRow.date, "MODAL") : null}
                  </View>
                </View>
              ))}
            </View>
          ))}

          {user?.role == "ADMIN" && (
            <>
              <Divider type="HORIZONTAL" style={tw`mt-1`} />
              <Pressable style={tw`py-3`} onPress={() => {
                setDateToDelete(selectedRow?.date!)
                deleteEventModal.current?.toggleModal()
              }}>
                <Text style={tw`text-lg text-red-500 font-semibold`}>Termin löschen</Text>
              </Pressable>
              <Divider type="HORIZONTAL" style={tw`mb-1`} />
            </>
          )}
        </View>
      </Modal>

      <Modal type="CENTER" ref={selectUserModal}>
        <Text style={tw`text-center text-2xl underline my-2 font-semibold`}>Mitglied auswählen</Text>
        <View style={tw`flex-row flex-wrap px-2`}>
          {allExistingUsers.filter(user_ => user_.email != "root").filter(user_ => !user_.deleted).map(extUser => (
            <View key={extUser.userId} style={tw`px-2 py-1`}>
              <BoardAssignButton
                color="GREEN"
                text={extUser.firstname + " " + extUser.lastname}
                onPress={() => {
                  assignUser(extUser.userId, selectedRow!.date, selectedColumn!.columnId, navigation)
                  selectUserModal.current?.toggleModal()
                }}
              />
            </View>
          ))}
        </View>
      </Modal>

      <Modal type="CENTER" ref={deleteEventModal}>
        <H1 style={tw`mt-2 text-center`}>Termin löschen?</H1>
        <Text style={tw`mx-4`}>
          Soll der Termin{" "}
          <Text style={tw`font-semibold`}>{dateToDelete.length ? prettyDate(dateToDelete, false) : ""}</Text> wirklich
          glöscht werden?
        </Text>
        <Text style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden <Text style={tw`font-semibold`}>alle</Text> Eintragungen von Mitgliedern, sowie die Kommentare gelöscht.
          Dies kann nicht mehr Rückgängig gemacht werden!
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteEvent(dateToDelete)
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteEventModal.current?.toggleModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={editCommentModal}>
        <View style={tw.style({
          "px-6": isSm,
          "px-4": !isSm
        }, "py-6")}>
          <Text style={tw`font-bold text-lg`}>Kommentar anpassen</Text>
          <TextInput
            multiline
            editable
            numberOfLines={4}
            style={tw`border rounded-lg border-gray-400 px-2 py-1 opacity-85 text-lg`}
            placeholder="Kommentar eingeben"
            value={commentEditValue}
            onChangeText={setCommentEditValue}
          />
          <View style={tw`flex-row flex-wrap gap-1 mt-1`}>
            {allDefaultComments?.map(comment => (
              <Pressable key={comment.commentId} style={tw`border border-gray-400 rounded-lg py-1 px-2 flex-row items-center gap-2`} onPress={() => {
                setCommentEditValue(commentEditValue + comment.comment)
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
                updateComment(selectedRow!.date, selectedColumn!.columnId, commentEditValue)
              }}
              color={Color.GREEN}
            >
              Speichern
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BoardList;
