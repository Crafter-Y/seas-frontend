import ErrorDisplay from "@/components/ErrorDisplay";
import SettingsForm from "@/components/SettingsForm";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import H1 from "@/components/elements/H1";
import H2 from "@/components/elements/H2";
import Input from "@/components/elements/Input";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import Picker from "@/components/elements/Picker";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import useAllColumns from "@/hooks/api/useAllColumns";
import useAllPages from "@/hooks/api/useAllPages";
import useCreateColumn from "@/hooks/api/useCreateColumn";
import useDeleteColumn from "@/hooks/api/useDeleteColumn";
import useMediaQueries from "@/hooks/useMediaQueries";
import { RootStackParamList } from "@/navigator/RootNavigator";
import tw from "@/tailwind";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

export type ManagePositionsScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManagePositionsScreen"
>;

const ManagePositionsScreen = () => {
  const navigation = useNavigation<ManagePositionsScreenProps>();

  const { isMd } = useMediaQueries();

  const {
    createColumn,
    hasCreationError,
    creationError,
    successfulColumnCreation,
  } = useCreateColumn();

  const { allColumns, queryColumns } = useAllColumns();
  const { allPages } = useAllPages();

  const deleteColumn = useDeleteColumn();

  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("POSITION");

  const columnNameInput = useRef<TextInput>(null);

  const deleteColumnModal = useRef<ModalHandle>(null);

  const [columnIdToChange, setColumnIdToChange] = useState("");
  const [columnNameToChange, setColumnNameToChange] = useState("");

  useEffect(() => {
    if (successfulColumnCreation) queryColumns();
  }, [successfulColumnCreation]);

  return (
    <SettingsLayout navigation={navigation}>
      <H2
        style={tw.style(
          {
            "text-center": !isMd,
          },
          "mt-4"
        )}
      >
        Spalten verwalten
      </H2>

      <SettingsForm>
        <Text>
          Hier können verscheidene Spalten erstellen werden und Plänen
          zugewiesen werden. Mitglieder haben dann die Möglichkeit sich in einer
          Spalte einzutragen und Moderatoren haben die Möglichkeit
          Kommentarfelder zu ändern.
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
            createColumn(columnName, columnType, navigation);
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
            <TR key={column.columnId}>
              <TD>
                <Text style={tw`text-lg`}>{column.name}</Text>
                <Text>
                  {column.type == "COMMENT" ? "Kommentarfeld" : "Eintragefeld"}
                </Text>
              </TD>
              <TD>
                {column.pages.map((pageId) => (
                  <Text key={pageId}>
                    {
                      allPages.filter(
                        (page) => "page_" + page.pageId == pageId
                      )[0]?.name
                    }
                  </Text>
                ))}
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`}>
                <Button
                  color="#f67e7e"
                  style={tw`p-1`}
                  onPress={() => {
                    setColumnIdToChange(column.columnId);
                    setColumnNameToChange(column.name);
                    deleteColumnModal.current?.toggleModal();
                  }}
                >
                  <Image
                    source={require("@/assets/img/close.svg")}
                    style={{ height: 24, width: 24 }}
                  />
                </Button>
                <Button
                  style={tw`p-1`}
                  onPress={() => {
                    setColumnIdToChange(column.columnId);
                    setColumnNameToChange(column.name);
                    //requestNewPasswordModal.current?.toggleModal();
                  }}
                >
                  <Image
                    source={require("@/assets/img/edit.svg")}
                    style={{ height: 24, width: 24 }}
                  />
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
          <Text style={tw`font-semibold`}>{columnNameToChange}</Text> wirklich
          glöscht werden?
        </Text>
        <Text style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden alle Eintragungen von Mitgliedern in dieser Spalte
          unwiderruflich gelöscht!
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteColumn(columnIdToChange);
              setTimeout(() => {
                queryColumns();
                deleteColumnModal.current?.toggleModal();
                setTimeout(() => {
                  queryColumns();
                }, 200);
              }, 200);
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteColumnModal.current?.toggleModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
};

export default ManagePositionsScreen;
