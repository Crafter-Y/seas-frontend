import ErrorDisplay from "@/components/ErrorDisplay";
import SettingsForm from "@/components/SettingsForm";
import Button from "@/components/elements/Button";
import Checkbox from "@/components/elements/Checkbox";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import H1 from "@/components/elements/H1";
import Input from "@/components/elements/Input";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import Picker from "@/components/elements/Picker";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import useAllColumns from "@/hooks/api/useAllColumns";
import useAllPages from "@/hooks/api/useAllPages";
import useAssignColumns, {
  AssignmentChange,
} from "@/hooks/api/useAssignColumns";
import useCreateColumn from "@/hooks/api/useCreateColumn";
import useDeleteColumn from "@/hooks/api/useDeleteColumn";
import useRenameColumn from "@/hooks/api/useRenameColumn";
import tw from "@/tailwind";
import { Picker as RNPicker } from "@react-native-picker/picker";
import Image from "@/components/elements/Image";
import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import SettingsTitle from "@/components/settings/SettingsTitle";

export default function ManagePositionsScreen() {
  const {
    createColumn,
    hasCreationError,
    creationError,
    successfulColumnCreation,
  } = useCreateColumn();

  const { allColumns, queryColumns } = useAllColumns();
  const { allPages } = useAllPages();

  const { renameColumn, hasRenameError, renameError, successfulColumnRename } =
    useRenameColumn();

  const { deleteColumn, succesfulDeletion } = useDeleteColumn();

  const { assignColumns, assignmentSuccessful } = useAssignColumns();

  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("POSITION");

  const columnNameInput = useRef<TextInput>(null);
  const renameInput = useRef<TextInput>(null);

  const deleteColumnModal = useRef<ModalHandle>(null);
  const modifyModal = useRef<ModalHandle>(null);

  const [columnToChange, setColumnToChange] = useState<APIResponseColumn>();

  const [columnRenameName, setColumnRenameName] = useState("");

  const [assignmentChanges, setAssignmentChanges] = useState<
    AssignmentChange[]
  >([]);

  useEffect(() => {
    if (successfulColumnCreation) queryColumns();
  }, [successfulColumnCreation]);

  useEffect(() => {
    if (succesfulDeletion) {
      queryColumns();
      deleteColumnModal.current?.closeModal();
    }
  }, [succesfulDeletion]);

  useEffect(() => {
    if (successfulColumnRename && assignmentSuccessful) {
      queryColumns();
      modifyModal.current?.closeModal();
    }
  }, [successfulColumnRename, assignmentSuccessful]);

  return (
    <SettingsLayout actualSetting="positions">
      <SettingsTitle>Spalten verwalten</SettingsTitle>

      <SettingsForm>
        <Text>
          Hier können verscheidene Spalten erstellen werden und Plänen
          zugewiesen werden.
        </Text>

        <Input
          style={tw`mt-4`}
          placeholder="Spaltenname"
          onChangeText={(text) => setColumnName(text)}
          secureTextEntry={false}
          ref={columnNameInput}
          onSubmitEditing={() => columnNameInput.current?.blur()}
          returnKeyType="done"
        />
        <Picker
          selectedValue={columnType}
          onValueChange={(itemValue) => setColumnType(itemValue)}
        >
          <RNPicker.Item label="Eintragefeld" value="POSITION" />
          <RNPicker.Item label="Kommentarfeld" value="COMMENT" />
        </Picker>

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Button
          onPress={() => {
            createColumn(columnName, columnType);
            columnNameInput.current?.blur();
            columnNameInput.current?.clear();
          }}
        >
          Spalte erstellen
        </Button>
      </SettingsForm>

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Spalten", "Pläne", ""]}></TH>
          {allColumns.map((column) => (
            <TR key={column.id}>
              <TD cols={3}>
                <Text style={tw`text-lg`}>{column.name}</Text>
                <Text>
                  {column.type == "COMMENT" ? "Kommentarfeld" : "Eintragefeld"}
                </Text>
              </TD>
              <TD cols={3}>
                {column.pages.map((pageId) => (
                  <Text key={pageId}>
                    {allPages.filter((page) => page.id == pageId)[0]?.name}
                  </Text>
                ))}
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={3}>
                <Button
                  color="#f67e7e"
                  style={tw`p-1`}
                  onPress={() => {
                    setColumnToChange(column);
                    deleteColumnModal.current?.openModal();
                  }}
                >
                  <Image source={require("@/assets/img/close.svg")} size={24} />
                </Button>
                <Button
                  style={tw`p-1`}
                  onPress={() => {
                    setColumnToChange(column);
                    setAssignmentChanges([]);
                    setColumnRenameName(column.name);
                    modifyModal.current?.openModal();
                  }}
                >
                  <Image source={require("@/assets/img/edit.svg")} size={24} />
                </Button>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <Modal type="CENTER" ref={deleteColumnModal}>
        <H1 style={tw`mt-2 text-center`}>Spalte löschen?</H1>
        <Text style={tw`mx-4`}>
          Soll die Spalte{" "}
          <Text style={tw`font-semibold`}>{columnToChange?.name}</Text> wirklich
          glöscht werden?
        </Text>
        <Text style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden alle Eintragungen von Mitgliedern in dieser Spalte
          unwiderruflich gelöscht!
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteColumn(columnToChange!.id);
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteColumnModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={modifyModal}>
        <H1 style={tw`mt-2 text-center`}>Spalte bearbeiten</H1>

        <Text style={tw`mt-4 mx-4`}>Neuen Spalten Namen festlegen</Text>

        <Input
          initialValue={columnToChange?.name}
          style={"mx-4"}
          placeholder="Plan Name"
          onChangeText={(text) => setColumnRenameName(text)}
          secureTextEntry={false}
          ref={renameInput}
          onSubmitEditing={() => {
            renameColumn(columnToChange!.id, columnRenameName);
            renameInput.current?.blur();
          }}
          returnKeyType="done"
        />

        <ErrorDisplay
          style={tw`mx-4`}
          hasError={hasRenameError}
          error={renameError}
        />

        <Text style={tw`mt-4 mx-4`}>Spalten zu Plänen zuordnen</Text>
        {allPages.map((page) => (
          <Checkbox
            label={page.name}
            key={page.id}
            defaultValue={columnToChange?.pages.includes(page.id)}
            onChange={(isAssigned) => {
              if (columnToChange?.pages.includes(page.id) == isAssigned) {
                // thing has changed - add it to the changes array
                assignmentChanges.push({
                  pageId: page.id,
                  columnId: columnToChange!.id,
                  isAssigned: !isAssigned,
                });
              } else {
                // thing has not changed - remove it from the changed if it is in there
                const index = assignmentChanges.indexOf(
                  assignmentChanges.filter(
                    (entr) =>
                      entr.columnId == columnToChange!.id &&
                      entr.pageId == page.id
                  )[0]
                );

                if (index > -1) {
                  assignmentChanges.splice(index, 1);
                }
              }
            }}
          />
        ))}

        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              assignColumns(assignmentChanges);
              renameColumn(columnToChange!.id, columnRenameName);
              renameInput.current?.blur();
            }}
            color="#f67e7e"
          >
            Speichern
          </Button>
          <Button onPress={() => modifyModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
}
