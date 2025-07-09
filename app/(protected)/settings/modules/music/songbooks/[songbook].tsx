import AntDesign from "@expo/vector-icons/AntDesign";
import { FlashList } from "@shopify/flash-list";
import { Redirect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextInput, View } from "react-native";

import Button from "@/components/elements/Button";
import Checkbox from "@/components/elements/Checkbox";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import Input from "@/components/elements/Input";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsActionButton from "@/components/settings/SettingsActionButton";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsBackButton from "@/components/SettingsBackButton";
import SettingsForm from "@/components/SettingsForm";
import { Color } from "@/helpers/Constants";
import useSongbook from "@/hooks/api/useSongbook";
import useMediaQueries from "@/hooks/useMediaQueries";

export default function Songbook() {
  const { songbook } = useLocalSearchParams();
  const {
    songs,
    querySongbook,
    editable,
    createSong,
    creationError,
    editError,
    editSong,
    deleteSong,
    setKnownState,
  } = useSongbook();
  const { isMd } = useMediaQueries();

  const { t } = useTranslation();

  const createModal = useRef<ModalHandle>(null);
  const createNumberInput = useRef<TextInput>(null);
  const createTitleInput = useRef<TextInput>(null);
  const [createNumber, setCreateNumber] = useState("");
  const [createTitle, setCreateTitle] = useState("");

  const editModal = useRef<ModalHandle>(null);
  const [selectedSong, setSelectedSong] =
    useState<APIResponseSongbookSong | null>(null);
  const editNumberInput = useRef<TextInput>(null);
  const editTitleInput = useRef<TextInput>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const deleteModal = useRef<ModalHandle>(null);

  useEffect(() => {
    querySongbook(Number(songbook));
  }, [querySongbook, songbook]);

  const addSong = useCallback(async () => {
    createTitleInput.current?.blur();
    let success = await createSong(createNumber, createTitle, Number(songbook));

    if (success) createModal.current?.closeModal();
  }, [createNumber, createSong, createTitle, songbook]);

  const submitEditSong = useCallback(async () => {
    editTitleInput.current?.blur();
    let success = await editSong(selectedSong!.id, editTitle, editNumber);

    if (success) {
      await querySongbook(Number(songbook));
      editModal.current?.closeModal();
    }
  }, [editNumber, editSong, editTitle, querySongbook, selectedSong, songbook]);

  const submitDeleteSong = useCallback(async () => {
    let success = await deleteSong(selectedSong!.id);

    if (success) {
      await querySongbook(Number(songbook));
      deleteModal.current?.closeModal();
    }
  }, [deleteSong, querySongbook, selectedSong, songbook]);

  if (!songbook || isNaN(Number(songbook))) {
    console.error("Invalid or none songbook ID provided:", songbook);
    return <Redirect href="/settings/modules/music/songbooks" />;
  }

  return (
    <SettingsLayout actualSetting="modules">
      {/* TODO: fix this really poor performance. It takes up to a couple seconds to render this thing if there are a couple houndred songs */}
      <FlashList
        data={songs}
        estimatedItemSize={75}
        ListHeaderComponent={
          <>
            {isMd && (
              <SettingsBackButton
                backRoute="/settings/modules/music/songbooks"
                label={t("backToSongbooks")}
              />
            )}
            <SettingsTitle t="editSongs" />

            <SettingsForm>
              <CustomText t="editSongsDescription" />
              <Button
                className={`mt-2 ${editable ? "" : "hidden"}`}
                onPress={() => {
                  createModal.current?.openModal();
                }}
              >
                <CustomText t="addSong" />
              </Button>
            </SettingsForm>
            <Divider type="HORIZONTAL" className="my-4" />

            <SettingsForm>
              <Form>
                <TH titles={[t("song"), "", t("known")]}></TH>
              </Form>
            </SettingsForm>
          </>
        }
        ListFooterComponent={<View className="h-2 w-2 mb-8"></View>}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: song }) => {
          return (
            <SettingsForm key={song.id}>
              <TR className="shadow-lg py-3">
                <View className="flex-1 justify-center px-4">
                  <CustomText className="text-lg">{song.title}</CustomText>
                  <CustomText>({song.number})</CustomText>
                </View>
                <View className="flex-row gap-4 pr-4">
                  <Checkbox
                    onChange={(state) => {
                      setKnownState(song.id, !state); // TODO: checkbox delivers wrong state - after the checkbox is fixed, this needs to be fixes (remove !)
                    }}
                    defaultValue={song.known}
                    disabled={song.locked}
                  />
                  {editable && (
                    <SettingsActionButton
                      onPress={() => {
                        setSelectedSong(song);
                        setEditNumber(song.number);
                        setEditTitle(song.title);
                        editModal.current?.openModal();
                      }}
                    >
                      <AntDesign name="edit" size={24} color="black" />
                    </SettingsActionButton>
                  )}
                </View>
              </TR>
            </SettingsForm>
          );
        }}
        ListEmptyComponent={
          <SettingsForm>
            <CustomText className="m-2 text-lg" t="noEntriesPresent" />
          </SettingsForm>
        }
      />

      <ModalRewrite title="modal.music.addSong" ref={createModal} scrollable>
        <CustomText className="mx-4">{t("directoryNumber")}:</CustomText>
        <Input
          placeholder={t("directoryNumberPlaceholder")}
          onChangeText={setCreateNumber}
          ref={createNumberInput}
          className="mx-4"
          onSubmitEditing={() => {
            createTitleInput.current?.focus();
          }}
          returnKeyType="next"
        />
        <CustomText className="mx-4 mt-2">{t("title")}:</CustomText>
        <Input
          placeholder={t("songTitlePlaceholder")}
          onChangeText={setCreateTitle}
          ref={createTitleInput}
          className="mx-4"
          onSubmitEditing={() => {
            createTitleInput.current?.blur();
            createSong(createNumber, createTitle, Number(songbook));
          }}
          returnKeyType="done"
        />
        <ErrorDisplay
          className="mx-4"
          hasError={creationError !== null}
          error={creationError + ""}
        />
        <View className="justify-center flex-row gap-2 my-4">
          <Button onPress={() => createModal.current?.closeModal()}>
            {t("cancel")}
          </Button>
          <Button onPress={addSong} color={Color.GREEN}>
            {t("create")}
          </Button>
        </View>
      </ModalRewrite>

      <ModalRewrite title="modal.music.addSong" ref={editModal} scrollable>
        <CustomText className="mx-4">{t("directoryNumber")}:</CustomText>
        <Input
          initialValue={selectedSong?.number}
          placeholder={t("directoryNumberPlaceholder")}
          onChangeText={setEditNumber}
          ref={editNumberInput}
          className="mx-4"
          onSubmitEditing={() => {
            editNumberInput.current?.blur();
          }}
        />
        <CustomText className="mx-4 mt-2">{t("title")}:</CustomText>
        <Input
          initialValue={selectedSong?.title}
          placeholder={t("songTitlePlaceholder")}
          onChangeText={setEditTitle}
          ref={editTitleInput}
          className="mx-4"
          onSubmitEditing={() => {
            editTitleInput.current?.blur();
          }}
        />
        <Divider type="HORIZONTAL" className="mt-3" />
        <Pressable
          className="py-3"
          onPress={() => {
            editModal.current?.closeModal();
            deleteModal.current?.openModal();
          }}
        >
          <CustomText
            className="text-lg text-red-500 font-semibold px-4"
            t="deleteSong"
          />
        </Pressable>
        <Divider type="HORIZONTAL" className="mb-1" />
        <ErrorDisplay
          className="mx-4"
          hasError={editError !== null}
          error={editError + ""}
        />
        <View className="justify-center flex-row gap-2 my-4">
          <Button onPress={() => editModal.current?.closeModal()}>
            {t("cancel")}
          </Button>
          <Button onPress={submitEditSong} color={Color.GREEN}>
            {t("save")}
          </Button>
        </View>
      </ModalRewrite>

      <ModalRewrite title="modal.music.deleteSong" ref={deleteModal}>
        <CustomText className="mx-4">
          {t("songDeletion.1")}{" "}
          <CustomText className="font-semibold">
            {selectedSong?.title} ({selectedSong?.number})
          </CustomText>
          {t("songDeletion.2")}
        </CustomText>
        <CustomText
          className="text-red-400 mx-4 mt-2"
          t="songbookDeleteDescription"
        />
        <View className="justify-center flex-row gap-2 my-4">
          <Button onPress={submitDeleteSong} color={Color.RED}>
            {t("delete")}
          </Button>
          <Button onPress={() => deleteModal.current?.closeModal()}>
            {t("cancel")}
          </Button>
        </View>
      </ModalRewrite>
    </SettingsLayout>
  );
}
