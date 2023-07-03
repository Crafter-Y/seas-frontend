import { Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import H2 from "@/components/elements/H2";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import SettingsForm from "@/components/SettingsForm";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import TH from "@/components/elements/TH";
import useAllPages from "@/hooks/api/useAllPages";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import { Image } from "expo-image";
import useCreatePage from "@/hooks/api/useCreatePage";
import ErrorDisplay from "@/components/ErrorDisplay";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import H1 from "@/components/elements/H1";
import useDeletePage from "@/hooks/api/useDeletePage";
import useRenamePage from "@/hooks/api/useRenamePage";

export type ManagePagesScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManagePagesScreen"
>;

const ManagePagesScreen = () => {
  const navigation = useNavigation<ManagePagesScreenProps>();

  const { isMd } = useMediaQueries();

  const { allPages, queryPages } = useAllPages();

  const deletePage = useDeletePage();

  const { renamePage, hasRenameError, renameError, successfulPageRename } =
    useRenamePage();

  const [pageName, setPageName] = useState("");

  const input = useRef<TextInput>(null);
  const renameInput = useRef<TextInput>(null);
  const deleteModal = useRef<ModalHandle>(null);
  const renameModal = useRef<ModalHandle>(null);

  const [pageIdToChange, setPageIdToChange] = useState("");
  const [pageNameToChange, setPageNameToChange] = useState("");

  const [pageRenameName, setPageRenameName] = useState("");

  const {
    createPage,
    hasCreationError,
    creationError,
    successfulPageCreation,
  } = useCreatePage();

  useEffect(() => {
    if (successfulPageCreation) queryPages();
  }, [successfulPageCreation]);

  useEffect(() => {
    if (successfulPageRename) {
      queryPages();
      renameModal.current?.toggleModal();
    }
  }, [successfulPageRename]);

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
        Pläne verwalten
      </H2>

      <SettingsForm>
        <Text>
          Durch verschiedene Pläne können Gruppen erstellt werden, die getrennt
          voneinander angezeigt werden können.
        </Text>

        <Input
          style={tw`mt-4`}
          placeholder="Plan Name"
          onChangeText={(text) => setPageName(text)}
          secureTextEntry={false}
          ref={input}
          onSubmitEditing={() => {
            createPage(pageName, navigation);
            input.current?.clear();
            input.current?.blur();
          }}
          returnKeyType="done"
        />

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Button
          onPress={() => {
            createPage(pageName, navigation);
            input.current?.clear();
            input.current?.blur();
          }}
        >
          Plan erstellen
        </Button>
      </SettingsForm>

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Pläne", ""]}></TH>

          {allPages.map((page) => (
            <TR key={page.pageId}>
              <TD style={tw`justify-center`}>
                <Text style={tw`text-lg`}>{page.name}</Text>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`}>
                <Button
                  color="#f67e7e"
                  style={tw`p-1`}
                  onPress={() => {
                    setPageIdToChange(page.pageId);
                    setPageNameToChange(page.name);
                    deleteModal.current?.toggleModal();
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
                    setPageIdToChange(page.pageId);
                    setPageNameToChange(page.name);
                    renameModal.current?.toggleModal();
                  }}
                >
                  <Image
                    source={require("@/assets/img/refresh.svg")}
                    style={{ height: 24, width: 24 }}
                  />
                </Button>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <Modal type="CENTER" ref={deleteModal}>
        <H1 style={tw`mt-2 text-center`}>Plan löschen?</H1>
        <Text style={tw`mx-4`}>
          Soll der Plan{" "}
          <Text style={tw`font-semibold`}>{pageNameToChange}</Text> wirklich
          glöscht werden?
        </Text>
        <Text style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden alle Eintragungen von Mitgliedern auf diesem Plan
          unwiderruflich gelöscht!
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deletePage(pageIdToChange);
              setTimeout(() => {
                queryPages();
                deleteModal.current?.toggleModal();
                setTimeout(() => {
                  queryPages();
                }, 200);
              }, 200);
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteModal.current?.toggleModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={renameModal}>
        <H1 style={tw`mt-2 text-center`}>Plan umbenennen</H1>

        <Text style={tw`mt-4 mx-4`}>Neuen Plan Namen festlegen</Text>

        <Input
          initialValue={pageNameToChange}
          style={"mx-4"}
          placeholder="Plan Name"
          onChangeText={(text) => setPageRenameName(text)}
          secureTextEntry={false}
          ref={renameInput}
          onSubmitEditing={() => {
            renamePage(pageIdToChange, pageRenameName, navigation);
            renameInput.current?.blur();
          }}
          returnKeyType="done"
        />

        <ErrorDisplay
          style={tw`mx-4`}
          hasError={hasRenameError}
          error={renameError}
        />

        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              renamePage(pageIdToChange, pageRenameName, navigation);
              renameInput.current?.blur();
            }}
            color="#f67e7e"
          >
            Umbenennen
          </Button>
          <Button onPress={() => renameModal.current?.toggleModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
};

export default ManagePagesScreen;
