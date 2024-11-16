import { Text } from "react-native";
import React from "react";
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
import Image from "@/components/elements/Image";
import { router } from "expo-router";
import useRestrictions from "@/hooks/api/useRestrictions";
import Callout from "@/components/elements/Callout";

export default function index() {
  const { isMd } = useMediaQueries();
  const { ownSongbooks } = useOwnSongbooks();
  const { restrictions } = useRestrictions();

  return (
    <SettingsLayout actualSetting="modules">
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
      </SettingsForm>
      {/* TODO: implement creation */}
      <Button
        style={tw`self-start mt-2`}
        disabled={restrictions?.maxOwnSongbooks == ownSongbooks.length}
      >
        <Text>Chorliste erstellen</Text>
      </Button>
      <Callout
        visible={restrictions?.maxOwnSongbooks == ownSongbooks.length}
        message="Sie haben die maximale Anzahl eigener Chorlisten für Ihr Produkt erreicht."
      />

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

              <TD style={tw`items-center justify-center`} cols={3}>
                <Button
                  style={tw`p-2.5`}
                  onPress={() =>
                    router.navigate(
                      "/settings/modules/music/songbooks/" + songbook.id
                    )
                  }
                >
                  <Image source={require("@/assets/img/edit.svg")} size={24} />
                </Button>
              </TD>
            </TR>
          ))}
          {ownSongbooks.length == 0 && (
            <Text style={tw`m-2 text-lg`}>Noch keine Einträge vorhanden.</Text>
          )}
        </Form>
      </SettingsForm>
    </SettingsLayout>
  );
}
