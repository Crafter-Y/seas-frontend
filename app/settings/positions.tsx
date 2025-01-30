import ErrorDisplay from "@/components/ErrorDisplay";
import SettingsForm from "@/components/SettingsForm";
import Button from "@/components/elements/Button";
import Checkbox from "@/components/elements/Checkbox";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import Input from "@/components/elements/Input";
import { ModalHandle } from "@/components/elements/Modal";
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
import { TextInput, View } from "react-native";
import SettingsTitle from "@/components/settings/SettingsTitle";
import ModalRewrite from "@/components/elements/ModalRewrite";
import { Color } from "@/helpers/Constants";
import useRestrictions from "@/hooks/api/useRestrictions";
import Callout from "@/components/elements/Callout";
import CustomText from "@/components/elements/CustomText";

export default function ManagePositionsScreen() {
  const {
    createColumn,
    hasCreationError,
    creationError,
    successfulColumnCreation,
  } = useCreateColumn();

  const { allColumns, queryColumns } = useAllColumns();
  const { allPages, queryPages } = useAllPages();

  const { renameColumn, hasRenameError, renameError, successfulColumnRename } =
    useRenameColumn();

  const { deleteColumn, succesfulDeletion } = useDeleteColumn();

  const { assignColumns, assignmentSuccessful } = useAssignColumns();

  const { restrictions, queryRestrictions } = useRestrictions();

  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("POSITION");

  const [maxColsReached, setMaxColsReached] = useState(false);

  const columnNameInput = useRef<TextInput>(null);
  const renameInput = useRef<TextInput>(null);

  const deleteColumnModal = useRef<ModalHandle>(null);
  const editModal = useRef<ModalHandle>(null);

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
  }, [queryColumns, succesfulDeletion]);

  useEffect(() => {
    if (successfulColumnRename && assignmentSuccessful) {
      queryColumns();
      editModal.current?.closeModal();
    }
  }, [successfulColumnRename, assignmentSuccessful]);

  useEffect(() => {
    if (
      restrictions &&
      allColumns &&
      restrictions.maxColumns <= allColumns.length
    ) {
      setMaxColsReached(true);
    }
  }, [restrictions, allColumns]);

  return (
    <SettingsLayout
      actualSetting="positions"
      refreshAction={() => {
        queryRestrictions();
        queryColumns();
        queryPages();
      }}
    >
      <SettingsTitle>Spalten verwalten</SettingsTitle>

      <SettingsForm>
        <CustomText>
          Hier können verscheidene Spalten erstellen werden und Plänen
          zugewiesen werden.
        </CustomText>

        <Input
          className="mt-4"
          disabled={maxColsReached}
          placeholder="Spaltenname"
          onChangeText={(text) => setColumnName(text)}
          secureTextEntry={false}
          ref={columnNameInput}
          onSubmitEditing={() => columnNameInput.current?.blur()}
          returnKeyType="done"
        />
        <Picker
          selectedValue={columnType}
          disabled={maxColsReached}
          onValueChange={(itemValue) => setColumnType(itemValue)}
        >
          <RNPicker.Item label="Eintragefeld" value="POSITION" />
          <RNPicker.Item label="Kommentarfeld" value="COMMENT" />
        </Picker>

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Callout
          visible={maxColsReached}
          message="Die maximale Anzahl an Spalten wurde für Ihr Produkt erreicht."
        />

        <Button
          disabled={maxColsReached}
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

      <Callout
        visible={!restrictions?.columnsDeletable}
        message="Das Löschen von Spalten ist in Ihrem Produkt deaktiviert."
      />

      <Callout
        visible={!restrictions?.columnsChangable}
        message="Das Bearbeiten von Spalten ist in Ihrem Produkt deaktiviert."
      />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Spalten", "Pläne", ""]}></TH>
          {allColumns.map((column) => (
            <TR key={column.id}>
              <TD cols={3}>
                <CustomText style={tw`text-lg`}>{column.name}</CustomText>
                <CustomText>
                  {column.type === "COMMENT" ? "Kommentarfeld" : "Eintragefeld"}
                </CustomText>
              </TD>
              <TD cols={3}>
                {column.pages.map((pageId) => (
                  <CustomText key={pageId}>
                    {allPages.filter((page) => page.id === pageId)[0]?.name}
                  </CustomText>
                ))}
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={3}>
                <Button
                  color={Color.RED}
                  className="p-2.5"
                  disabled={!restrictions?.columnsDeletable}
                  onPress={() => {
                    setColumnToChange(column);
                    deleteColumnModal.current?.openModal();
                  }}
                >
                  <Image source={require("@/assets/img/close.svg")} size={24} />
                </Button>
                <Button
                  className="p-2.5"
                  disabled={!restrictions?.columnsChangable}
                  onPress={() => {
                    setColumnToChange(column);
                    setAssignmentChanges([]);
                    setColumnRenameName(column.name);
                    editModal.current?.openModal();
                  }}
                >
                  <Image source={require("@/assets/img/edit.svg")} size={24} />
                </Button>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <ModalRewrite title="modal.columns.deleteColumn" ref={deleteColumnModal}>
        <CustomText style={tw`mx-4`}>
          Soll die Spalte{" "}
          <CustomText style={tw`font-semibold`}>
            {columnToChange?.name}
          </CustomText>{" "}
          wirklich glöscht werden?
        </CustomText>
        <CustomText style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden alle Eintragungen von Mitgliedern in dieser Spalte
          unwiderruflich gelöscht!
        </CustomText>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => deleteColumnModal.current?.closeModal()}>
            Abbrechen
          </Button>
          <Button
            onPress={() => {
              deleteColumn(columnToChange!.id);
            }}
            color={Color.RED}
          >
            Löschen
          </Button>
        </View>
      </ModalRewrite>

      <ModalRewrite title="modal.columns.editColumn" ref={editModal}>
        <CustomText style={tw`mt-4 mx-4`}>
          Neuen Spalten Namen festlegen
        </CustomText>

        <Input
          initialValue={columnToChange?.name}
          className="mx-4"
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

        <CustomText style={tw`mt-4 mx-4`}>
          Spalten zu Plänen zuordnen
        </CustomText>
        {allPages.map((page) => (
          <Checkbox
            label={page.name}
            key={page.id}
            defaultValue={columnToChange?.pages.includes(page.id)}
            onChange={(isAssigned) => {
              if (columnToChange?.pages.includes(page.id) === isAssigned) {
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
                      entr.columnId === columnToChange!.id &&
                      entr.pageId === page.id,
                  )[0],
                );

                if (index > -1) {
                  assignmentChanges.splice(index, 1);
                }
              }
            }}
          />
        ))}

        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => editModal.current?.closeModal()}>
            Abbrechen
          </Button>
          <Button
            onPress={() => {
              assignColumns(assignmentChanges);
              renameColumn(columnToChange!.id, columnRenameName);
              renameInput.current?.blur();
            }}
            color={Color.GREEN}
          >
            Speichern
          </Button>
        </View>
      </ModalRewrite>
    </SettingsLayout>
  );
}
