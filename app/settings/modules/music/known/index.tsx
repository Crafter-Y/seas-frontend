import { Text } from "react-native";
import React from "react";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import Divider from "@/components/elements/Divider";
import tw from "@/tailwind";
import useSongbooks from "@/hooks/api/useSongbooks";
import SettingsBackButton from "@/components/SettingsBackButton";
import Form from "@/components/elements/Form";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import Button from "@/components/elements/Button";
import Image from "@/components/elements/Image";
import { router } from "expo-router";
import useMediaQueries from "@/hooks/useMediaQueries";

export default function index() {
  const { songbooks } = useSongbooks();
  const { isMd } = useMediaQueries();

  return (
    <SettingsLayout actualSetting="modules">
      {isMd && (
        <SettingsBackButton
          backRoute="/settings/modules"
          label="Zurück zu Modulen"
        />
      )}
      <SettingsTitle>Bekannte Lieder festlegen</SettingsTitle>

      <SettingsForm>
        <Text>
          Sie können bekannte Lieder auswählen, damit diese im Journal bereits
          als &quot;Bekannt&quot; auftauchen.
        </Text>
      </SettingsForm>
      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Text>Chormappe auswählen:</Text>
        <Form>
          <TH titles={["Mappe", "bekannt", ""]}></TH>
          {songbooks.map((songbook) => (
            <TR key={songbook.id}>
              <TD cols={3}>
                <Text style={tw`text-lg`}>{songbook.name}</Text>
              </TD>
              <TD cols={3}>
                <Text>
                  {songbook.knownSongs} / {songbook.count} Lieder
                </Text>
              </TD>

              <TD style={tw`items-center justify-center`} cols={3}>
                <Button
                  style={tw`p-2.5`}
                  onPress={() =>
                    router.navigate(
                      "/settings/modules/music/known/" + songbook.id
                    )
                  }
                >
                  <Image source={require("@/assets/img/edit.svg")} size={24} />
                </Button>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>
    </SettingsLayout>
  );
}
