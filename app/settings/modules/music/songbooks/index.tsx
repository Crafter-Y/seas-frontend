import { Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsBackButton from "@/components/SettingsBackButton";
import useMediaQueries from "@/hooks/useMediaQueries";
import SettingsForm from "@/components/SettingsForm";
import Divider from "@/components/elements/Divider";
import tw from "@/tailwind";
import SettingsTitle from "@/components/settings/SettingsTitle";
import Button from "@/components/elements/Button";
import useOwnSongbooks from "@/hooks/api/useOwnSongbooks";
import Form from "@/components/elements/Form";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import useRestrictions from "@/hooks/api/useRestrictions";
import Callout from "@/components/elements/Callout";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import Input from "@/components/elements/Input";
import useCreateSongbook from "@/hooks/api/useCreateSongbook";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Color } from "@/helpers/Constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import useDeleteSongbook from "@/hooks/api/useDeleteSongbook";
import useRenameSongbook from "@/hooks/api/useRenameSongbook";

export default function index() {
  const { isMd } = useMediaQueries();
  const { ownSongbooks, querySongbooks } = useOwnSongbooks();
  const { restrictions } = useRestrictions();
  const {
    createSongbook,
    hasCreationError,
    creationError,
    successfulCreation,
  } = useCreateSongbook();
  const { deleteSongbook, succesfulDeletion } = useDeleteSongbook();
  const { renamePage, hasRenameError, renameError, successfulRename } =
    useRenameSongbook();

  const createModal = useRef<ModalHandle>(null);
  const createNameInput = useRef<TextInput>(null);
  const [createName, setCreateName] = useState("");

  const deleteModal = useRef<ModalHandle>(null);
  const [selectedSongbook, setSelectedSongbook] =
    useState<APISongbookResponse | null>(null);

  const renameModal = useRef<ModalHandle>(null);
  const renameInput = useRef<TextInput>(null);
  const [renameName, setRenameName] = useState("");

  useEffect(() => {
    if (successfulCreation) {
      querySongbooks();
      createModal.current?.closeModal();
    }
  }, [successfulCreation]);

  useEffect(() => {
    if (succesfulDeletion) {
      querySongbooks();
      deleteModal.current?.closeModal();
    }
  }, [succesfulDeletion]);

  useEffect(() => {
    if (successfulRename) {
      querySongbooks();
      renameModal.current?.closeModal();
    }
  }, [successfulRename]);

  return (
    <SettingsLayout actualSetting="modules" backTitle="Zurück">
      {isMd && (
        <SettingsBackButton
          backRoute="/settings/modules"
          label="Zurück zu Modulen"
        />
      )}
      <SettingsTitle>Eigene Chorlisten verwalten</SettingsTitle>

      <SettingsForm>
        <Text>
          Neben den Chorlisten, die wir Ihrem Produkt zugeteilt haben, können
          Sie hier Ihre eigenen Chorlisten erstellen und verwalten.
        </Text>
        <Button
          style={tw`self-start mt-2`}
          disabled={
            restrictions?.maxOwnSongbooks
              ? restrictions.maxOwnSongbooks <= ownSongbooks.length
              : false
          }
          onPress={() => createModal.current?.openModal()}
        >
          <Text>Chorliste erstellen</Text>
        </Button>
        <Callout
          visible={
            restrictions?.maxOwnSongbooks
              ? restrictions.maxOwnSongbooks <= ownSongbooks.length
              : false
          }
          message="Sie haben die maximale Anzahl eigener Chorlisten für Ihr Produkt erreicht."
        />
      </SettingsForm>

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Mappe", "Songs", ""]}></TH>
          {ownSongbooks.map((songbook) => (
            <TR key={songbook.id}>
              <TD cols={3}>
                <Text style={tw`text-lg`}>{songbook.name}</Text>
              </TD>
              <TD cols={3}>
                <Text>{songbook.count} Lieder</Text>
              </TD>

              <TD style={tw`justify-end flex-row items-center gap-1`} cols={3}>
                <Button
                  color="#f67e7e"
                  style={tw`p-2.5`}
                  disabled={!restrictions?.pagesDeletable}
                  onPress={() => {
                    setSelectedSongbook(songbook);
                    deleteModal.current?.openModal();
                  }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </Button>
                <Button
                  style={tw`p-2.5`}
                  onPress={() => {
                    setSelectedSongbook(songbook);
                    renameModal.current?.openModal();
                  }}
                >
                  <AntDesign name="edit" size={24} color="black" />
                </Button>
                <Button
                  style={tw`p-2.5`}
                  onPress={() => {
                    router.navigate(
                      "/settings/modules/music/songbooks/" + songbook.id
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    name="music-clef-treble"
                    size={24}
                    color="black"
                  />
                </Button>
              </TD>
            </TR>
          ))}
          {ownSongbooks.length == 0 && (
            <Text style={tw`m-2 text-lg`}>Noch keine Einträge vorhanden.</Text>
          )}
        </Form>
      </SettingsForm>
      <ModalRewrite title="Chormappe erstellen" ref={createModal} scrollable>
        <Text style={tw`mx-4`}>Name</Text>
        <Input
          placeholder="Name der Chormappe"
          onChangeText={setCreateName}
          ref={createNameInput}
          style={"mx-4"}
          onSubmitEditing={() => {
            createNameInput.current?.blur();
            createSongbook(createName);
          }}
        />
        <ErrorDisplay
          style={tw`mx-4`}
          hasError={hasCreationError}
          error={creationError}
        />
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => createModal.current?.closeModal()}>
            Abbrechen
          </Button>
          <Button
            onPress={() => {
              createNameInput.current?.blur();
              createSongbook(createName);
            }}
            color={Color.GREEN}
          >
            Erstellen
          </Button>
        </View>
      </ModalRewrite>
      <ModalRewrite title="Chormappe löschen" ref={deleteModal}>
        <Text style={tw`mx-4`}>
          Soll der Plan{" "}
          <Text style={tw`font-semibold`}>{selectedSongbook?.name}</Text>{" "}
          wirklich glöscht werden?
        </Text>
        <Text style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden alle{" "}
          <Text style={tw`font-semibold`}>{selectedSongbook?.count}</Text> Songs
          gelöscht. Alle damit in Verbindung stehende Statistiken werden
          ebenfalls gelöscht.
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteSongbook(selectedSongbook!.id);
            }}
            color={Color.RED}
          >
            Löschen
          </Button>
          <Button onPress={() => deleteModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </ModalRewrite>
      <ModalRewrite title="Chormappe umbenennen" ref={renameModal}>
        <Text style={tw`mx-4`}>Name</Text>
        <Input
          initialValue={selectedSongbook?.name}
          style={"mx-4"}
          placeholder="Name der Chormappe"
          onChangeText={(text) => setRenameName(text)}
          secureTextEntry={false}
          ref={renameInput}
          onSubmitEditing={() => {
            renamePage(selectedSongbook!.id, renameName);
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
              renamePage(selectedSongbook!.id, renameName);
              renameInput.current?.blur();
            }}
            color={Color.GREEN}
          >
            Umbenennen
          </Button>
          <Button onPress={() => deleteModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </ModalRewrite>
    </SettingsLayout>
  );
}
