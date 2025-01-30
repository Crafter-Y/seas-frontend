import Button from "@/components/elements/Button";
import Callout from "@/components/elements/Callout";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import Input from "@/components/elements/Input";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsBackButton from "@/components/SettingsBackButton";
import SettingsForm from "@/components/SettingsForm";
import { Color } from "@/helpers/Constants";
import useCreateSongbook from "@/hooks/api/useCreateSongbook";
import useDeleteSongbook from "@/hooks/api/useDeleteSongbook";
import useRenameSongbook from "@/hooks/api/useRenameSongbook";
import useRestrictions from "@/hooks/api/useRestrictions";
import useSongbooks from "@/hooks/api/useSongbooks";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

export default function Index() {
  const { isMd } = useMediaQueries();
  const { songbooks, querySongbooks } = useSongbooks();
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
      <SettingsTitle>Chorlisten verwalten</SettingsTitle>

      <SettingsForm>
        <CustomText>
          Neben den Chorlisten, die wir Ihrem Produkt zugeteilt haben, können
          Sie Ihre eigenen Chorlisten erstellen und verwalten.
        </CustomText>
        <Button
          className="self-start mt-2"
          disabled={
            restrictions?.maxOwnSongbooks
              ? restrictions.maxOwnSongbooks <=
                songbooks.filter((book) => book.editable).length
              : false
          }
          onPress={() => createModal.current?.openModal()}
        >
          <CustomText>Chorliste erstellen</CustomText>
        </Button>
        <Callout
          visible={
            restrictions?.maxOwnSongbooks
              ? restrictions.maxOwnSongbooks <=
                songbooks.filter((book) => book.editable).length
              : false
          }
          message="Sie haben die maximale Anzahl eigener Chorlisten für Ihr Produkt erreicht."
        />
      </SettingsForm>

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Mappe", "Bekannt", ""]}></TH>
          {songbooks.map((songbook) => (
            <TR key={songbook.id}>
              <TD cols={3}>
                <CustomText style={tw`text-lg`}>{songbook.name}</CustomText>
              </TD>
              <TD cols={3}>
                <CustomText>
                  {songbook.knownSongs} / {songbook.count}
                </CustomText>
                <CustomText>Lieder</CustomText>
              </TD>

              <TD style={tw`justify-end flex-row items-center gap-1`} cols={3}>
                <Button
                  color="#f67e7e"
                  className="p-2.5"
                  disabled={!songbook.editable}
                  onPress={() => {
                    setSelectedSongbook(songbook);
                    deleteModal.current?.openModal();
                  }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </Button>
                <Button
                  className="p-2.5"
                  disabled={!songbook.editable}
                  onPress={() => {
                    setSelectedSongbook(songbook);
                    setRenameName(songbook.name);
                    renameModal.current?.openModal();
                  }}
                >
                  <AntDesign name="edit" size={24} color="black" />
                </Button>
                <Button
                  className="p-2.5"
                  onPress={() => {
                    router.navigate(
                      "/settings/modules/music/songbooks/" + songbook.id,
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
          {songbooks.length === 0 && (
            <CustomText style={tw`m-2 text-lg`}>
              Noch keine Einträge vorhanden.
            </CustomText>
          )}
        </Form>
      </SettingsForm>
      <ModalRewrite
        title="modal.music.createSongbook"
        ref={createModal}
        scrollable
      >
        <CustomText style={tw`mx-4`}>Name</CustomText>
        <Input
          placeholder="Name der Chormappe"
          onChangeText={setCreateName}
          ref={createNameInput}
          className="mx-4"
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
      <ModalRewrite title="modal.music.deleteSongbook" ref={deleteModal}>
        <CustomText style={tw`mx-4`}>
          Soll der Plan{" "}
          <CustomText style={tw`font-semibold`}>
            {selectedSongbook?.name}
          </CustomText>{" "}
          wirklich glöscht werden?
        </CustomText>
        <CustomText style={tw`text-red-400 mx-4 mt-2`}>
          Dadurch werden alle{" "}
          <CustomText style={tw`font-semibold`}>
            {selectedSongbook?.count}
          </CustomText>{" "}
          Songs gelöscht. Alle damit in Verbindung stehende Statistiken werden
          ebenfalls gelöscht.
        </CustomText>
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
      <ModalRewrite title="modal.music.renameSongbook" ref={renameModal}>
        <CustomText style={tw`mx-4`}>Name</CustomText>
        <Input
          initialValue={selectedSongbook?.name}
          className="mx-4"
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
          <Button onPress={() => renameModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </ModalRewrite>
    </SettingsLayout>
  );
}
