import Button from "@/components/elements/Button";
import Checkbox from "@/components/elements/Checkbox";
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
import useCreateSong from "@/hooks/api/useCreateSong";
import useDeleteSong from "@/hooks/api/useDeleteSong";
import useEditSong from "@/hooks/api/useEditSong";
import useSetKnownState from "@/hooks/api/useSetKnownState";
import useSongbook from "@/hooks/api/useSongbook";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function songbook() {
  const { songbook } = useLocalSearchParams();
  const { songs, querySongbook, editable } = useSongbook();
  const { setKnwonState } = useSetKnownState();
  const { isMd } = useMediaQueries();
  const { createSong, hasCreationError, creationError, successfulCreation } =
    useCreateSong();
  const { editSong, hasEditError, editError, successfulEdit } = useEditSong();
  const { deleteSong, succesfulDeletion } = useDeleteSong();

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
    if (songbook.length) {
      querySongbook(Number(songbook));
    }
  }, [songbook]);

  useEffect(() => {
    if (successfulCreation) {
      querySongbook(Number(songbook));
      createModal.current?.closeModal();
    }
  }, [successfulCreation]);

  useEffect(() => {
    if (successfulEdit) {
      querySongbook(Number(songbook));
      editModal.current?.closeModal();
    }
  }, [successfulEdit]);

  useEffect(() => {
    if (succesfulDeletion) {
      querySongbook(Number(songbook));
      deleteModal.current?.closeModal();
    }
  }, [succesfulDeletion]);

  return (
    <SettingsLayout actualSetting="modules">
      <FlashList
        data={songs}
        estimatedItemSize={75}
        ListHeaderComponent={
          <>
            {isMd && (
              <SettingsBackButton
                backRoute="/settings/modules/music/songbooks"
                label="Zurück zu Chorlisten"
              />
            )}
            <SettingsTitle>Lieder bearbeiten</SettingsTitle>

            <SettingsForm>
              <Text>
                Markierte Lieder sind bekannt. Sie können manuell Lieder als
                &quot;Bekannt&quot; markieren. Manche Checkboxen können Sie
                nicht mehr verändern, da bereits eine Eintragung für dieses Lied
                vorhanden ist. Alle Änderungen werden automatisch gespeichert.
              </Text>
              <Button
                style={tw`self-start mt-2 ${editable ? "" : "hidden"}`}
                onPress={() => {
                  createModal.current?.openModal();
                }}
              >
                <Text>Lied hinzufügen</Text>
              </Button>
            </SettingsForm>
            <Divider type="HORIZONTAL" style={tw`my-4`} />

            <SettingsForm>
              <Form>
                <TH titles={["Lied", "bekannt"]}></TH>
              </Form>
            </SettingsForm>
          </>
        }
        ListFooterComponent={<View style={tw`h-2 w-2 mb-8`}></View>}
        renderItem={({ item: song }) => {
          return (
            <SettingsForm key={song.id}>
              <Form>
                <TR>
                  <TD cols={2}>
                    <Text style={tw`text-lg`}>
                      {song.title} ({song.number})
                    </Text>
                  </TD>
                  <TD cols={2} style={tw`flex-row self-start justify-between`}>
                    <Checkbox
                      onChange={(state) => {
                        setKnwonState(song.id, !state); // TODO: checkbox delivers wrong state - after the checkbox is fixed, this needs to be fixes (remove !)
                      }}
                      defaultValue={song.known}
                      disabled={song.locked}
                    />
                    {editable && (
                      <Button
                        style={tw`p-2.5 self-start`}
                        onPress={() => {
                          setSelectedSong(song);
                          setEditNumber(song.number);
                          setEditTitle(song.title);
                          editModal.current?.openModal();
                        }}
                      >
                        <AntDesign name="edit" size={24} color="black" />
                      </Button>
                    )}
                  </TD>
                </TR>
              </Form>
            </SettingsForm>
          );
        }}
        ListEmptyComponent={
          <SettingsForm>
            <Text style={tw`m-2 text-lg`}>Noch keine Einträge vorhanden.</Text>
          </SettingsForm>
        }
      />
      <ModalRewrite title="Lied hinzufügen" ref={createModal} scrollable>
        <Text style={tw`mx-4`}>Verzeichnisnummer:</Text>
        <Input
          placeholder="1, 12b oder 5-1"
          onChangeText={setCreateNumber}
          ref={createNumberInput}
          style={"mx-4"}
          onSubmitEditing={() => {
            createTitleInput.current?.focus();
          }}
          returnKeyType="next"
        />
        <Text style={tw`mx-4 mt-2`}>Titel:</Text>
        <Input
          placeholder="Titel vom Lied"
          onChangeText={setCreateTitle}
          ref={createTitleInput}
          style={"mx-4"}
          onSubmitEditing={() => {
            createTitleInput.current?.blur();
            createSong(createNumber, createTitle, Number(songbook));
          }}
          returnKeyType="done"
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
              createTitleInput.current?.blur();
              createSong(createNumber, createTitle, Number(songbook));
            }}
            color={Color.GREEN}
          >
            Erstellen
          </Button>
        </View>
      </ModalRewrite>
      <ModalRewrite title="Lied hinzufügen" ref={editModal} scrollable>
        <Text style={tw`mx-4`}>Verzeichnisnummer:</Text>
        <Input
          initialValue={selectedSong?.number}
          placeholder="1, 12b oder 5-1"
          onChangeText={setEditNumber}
          ref={editNumberInput}
          style={"mx-4"}
          onSubmitEditing={() => {
            editNumberInput.current?.blur();
          }}
        />
        <Text style={tw`mx-4 mt-2`}>Titel:</Text>
        <Input
          initialValue={selectedSong?.title}
          placeholder="Titel vom Lied"
          onChangeText={setEditTitle}
          ref={editTitleInput}
          style={"mx-4"}
          onSubmitEditing={() => {
            editTitleInput.current?.blur();
          }}
        />
        <Divider type="HORIZONTAL" style={tw`mt-3`} />
        <Pressable
          style={tw`py-3`}
          onPress={() => {
            editModal.current?.closeModal();
            deleteModal.current?.openModal();
          }}
        >
          <Text style={tw`text-lg text-red-500 font-semibold px-4`}>
            Termin löschen
          </Text>
        </Pressable>
        <Divider type="HORIZONTAL" style={tw`mb-1`} />
        <ErrorDisplay
          style={tw`mx-4`}
          hasError={hasEditError}
          error={editError}
        />
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => editModal.current?.closeModal()}>
            Abbrechen
          </Button>
          <Button
            onPress={() => {
              createTitleInput.current?.blur();
              editSong(selectedSong!.id, editTitle, editNumber);
            }}
            color={Color.GREEN}
          >
            Speichern
          </Button>
        </View>
      </ModalRewrite>
      <ModalRewrite title="Lied löschen" ref={deleteModal}>
        <Text style={tw`mx-4`}>
          Soll das Lied{" "}
          <Text style={tw`font-semibold`}>
            {selectedSong?.title} ({selectedSong?.number})
          </Text>{" "}
          wirklich glöscht werden?
        </Text>
        <Text style={tw`text-red-400 mx-4 mt-2`}>
          Alle damit in Verbindung stehende Statistiken werden ebenfalls
          gelöscht.
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteSong(selectedSong!.id);
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
    </SettingsLayout>
  );
}
