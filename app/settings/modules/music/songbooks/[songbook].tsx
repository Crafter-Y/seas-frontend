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
import useSetKnownState from "@/hooks/api/useSetKnownState";
import useSongbook from "@/hooks/api/useSongbook";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function songbook() {
  const { songbook } = useLocalSearchParams();
  const { songs, querySongbook, editable } = useSongbook();
  const { setKnwonState } = useSetKnownState();
  const { isMd } = useMediaQueries();
  const { createSong, hasCreationError, creationError, successfulCreation } =
    useCreateSong();

  const createModal = useRef<ModalHandle>(null);
  const createNumberInput = useRef<TextInput>(null);
  const createTitleInput = useRef<TextInput>(null);
  const [createNumber, setCreateNumber] = useState("");
  const [createTitle, setCreateTitle] = useState("");

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
                          // TODO: setSelectedSongbook(songbook);
                          // renameModal.current?.openModal();
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
    </SettingsLayout>
  );
}
