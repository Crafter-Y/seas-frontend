import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, View } from "react-native";

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
import SettingsActionButton from "@/components/settings/SettingsActionButton";
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

export default function Index() {
  const { isMd } = useMediaQueries();
  const { songbooks, querySongbooks } = useSongbooks();
  const { restrictions } = useRestrictions();
  const { t } = useTranslation();
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
  }, [querySongbooks, successfulCreation]);

  useEffect(() => {
    if (succesfulDeletion) {
      querySongbooks();
      deleteModal.current?.closeModal();
    }
  }, [querySongbooks, succesfulDeletion]);

  useEffect(() => {
    if (successfulRename) {
      querySongbooks();
      renameModal.current?.closeModal();
    }
  }, [querySongbooks, successfulRename]);

  return (
    <SettingsLayout actualSetting="modules" backTitle="Zurück">
      {isMd && (
        <SettingsBackButton
          backRoute="/settings/modules"
          label="Zurück zu Modulen"
        />
      )}
      <SettingsTitle t="manageSongbooks" />

      <SettingsForm>
        <CustomText t="manageSongbooksDescription" />
        <Button
          className="mt-2 self-start"
          disabled={
            restrictions?.maxOwnSongbooks
              ? restrictions.maxOwnSongbooks <=
                songbooks.filter((book) => book.editable).length
              : false
          }
          onPress={() => createModal.current?.openModal()}
        >
          <CustomText t="createSongbook" />
        </Button>
        <Callout
          visible={
            restrictions?.maxOwnSongbooks
              ? restrictions.maxOwnSongbooks <=
                songbooks.filter((book) => book.editable).length
              : false
          }
          message={t("error.maxSongbooksReached")}
        />
      </SettingsForm>

      <Divider type="HORIZONTAL" className="my-4" />

      <SettingsForm className="mb-8">
        <Form>
          <TH titles={[t("book"), t("known"), ""]}></TH>
          {songbooks.map((songbook) => (
            <TR key={songbook.id}>
              <TD cols={3}>
                <CustomText className="text-lg">{songbook.name}</CustomText>
              </TD>
              <TD cols={3}>
                <CustomText>
                  {songbook.knownSongs} / {songbook.count}
                </CustomText>
                <CustomText t="songs" />
              </TD>

              <TD className="justify-end flex-row items-center gap-1" cols={3}>
                <SettingsActionButton
                  color={Color.RED}
                  disabled={!songbook.editable}
                  onPress={() => {
                    setSelectedSongbook(songbook);
                    deleteModal.current?.openModal();
                  }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </SettingsActionButton>
                <SettingsActionButton
                  disabled={!songbook.editable}
                  onPress={() => {
                    setSelectedSongbook(songbook);
                    setRenameName(songbook.name);
                    renameModal.current?.openModal();
                  }}
                >
                  <AntDesign name="edit" size={24} color="black" />
                </SettingsActionButton>
                <SettingsActionButton
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
                </SettingsActionButton>
              </TD>
            </TR>
          ))}
          {songbooks.length === 0 && (
            <CustomText className="m-2 text-lg" t="noEntiresPresent" />
          )}
        </Form>
      </SettingsForm>
      <ModalRewrite
        title="modal.music.createSongbook"
        ref={createModal}
        scrollable
      >
        <CustomText className="mx-4" t="name" />
        <Input
          placeholder={t("songbookName")}
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
            {t("cancel")}
          </Button>
          <Button
            onPress={() => {
              createNameInput.current?.blur();
              createSongbook(createName);
            }}
            color={Color.GREEN}
          >
            {t("create")}
          </Button>
        </View>
      </ModalRewrite>
      <ModalRewrite title="modal.music.deleteSongbook" ref={deleteModal}>
        <CustomText className="mx-4">
          <CustomText t="songbookDeletion.1" />
          <CustomText className="font-semibold">
            {selectedSongbook?.name}
          </CustomText>
          <CustomText t="songbookDeletion.2" />
        </CustomText>
        <CustomText className="text-red-400 mx-4 mt-2">
          <CustomText t="songbookDeletion.3" />
          <CustomText className="font-semibold">
            {selectedSongbook?.count}
          </CustomText>
          <CustomText t="songbookDeletion.4" />
        </CustomText>
        <View className="justify-center flex-row gap-2 my-4">
          <Button onPress={() => deleteModal.current?.closeModal()}>
            {t("cancel")}
          </Button>
          <Button
            onPress={() => {
              deleteSongbook(selectedSongbook!.id);
            }}
            color={Color.RED}
          >
            {t("delete")}
          </Button>
        </View>
      </ModalRewrite>
      <ModalRewrite title="modal.music.renameSongbook" ref={renameModal}>
        <CustomText className="mx-4" t="name" />
        <Input
          initialValue={selectedSongbook?.name}
          className="mx-4"
          placeholder={t("songbookName")}
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
          className="mx-4"
          hasError={hasRenameError}
          error={renameError}
        />

        <View className="justify-center flex-row gap-2 my-4">
          <Button onPress={() => renameModal.current?.closeModal()}>
            {t("cancel")}
          </Button>
          <Button
            onPress={() => {
              renamePage(selectedSongbook!.id, renameName);
              renameInput.current?.blur();
            }}
            color={Color.GREEN}
          >
            {t("rename")}
          </Button>
        </View>
      </ModalRewrite>
    </SettingsLayout>
  );
}
