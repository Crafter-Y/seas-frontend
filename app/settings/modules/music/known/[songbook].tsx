import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useSongbook from "@/hooks/api/useSongbook";
import { useEffect } from "react";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsBackButton from "@/components/SettingsBackButton";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import Divider from "@/components/elements/Divider";
import tw from "@/tailwind";
import Form from "@/components/elements/Form";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import Checkbox from "@/components/elements/Checkbox";
import useSetKnownState from "@/hooks/api/useSetKnownState";
import useMediaQueries from "@/hooks/useMediaQueries";
import { FlashList } from "@shopify/flash-list";

export default function songbook() {
  const { songbook } = useLocalSearchParams();
  const { songs, querySongbook } = useSongbook();
  const { setKnwonState } = useSetKnownState();
  const { isMd } = useMediaQueries();

  useEffect(() => {
    if (songbook.length) {
      querySongbook(Number(songbook));
    }
  }, [songbook]);

  return (
    <SettingsLayout actualSetting="modules">
      <FlashList
        data={songs}
        estimatedItemSize={75}
        ListHeaderComponent={
          <>
            {isMd && (
              <SettingsBackButton
                backRoute="/settings/modules/music/known"
                label="Zurück zu Chorlisten"
              />
            )}
            <SettingsTitle>Bekannte Lieder festlegen</SettingsTitle>

            <SettingsForm>
              <Text>
                Markierte Lieder sind bekannt. Sie können manuell Lieder als
                &quot;Bekannt&quot; markieren. Manche Checkboxen können Sie
                nicht mehr verändern, da bereits eine Eintragung für dieses Lied
                vorhanden ist. Alle Änderungen werden automatisch gespeichert.
              </Text>
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
                  <TD cols={2}>
                    <Checkbox
                      onChange={(state) => {
                        setKnwonState(song.id, !state); // TODO: checkbox delivers wrong state - after the checkbox is fixed, this needs to be fixes (remove !)
                      }}
                      defaultValue={song.known}
                      disabled={song.locked}
                    />
                  </TD>
                </TR>
              </Form>
            </SettingsForm>
          );
        }}
      />
    </SettingsLayout>
  );
}
