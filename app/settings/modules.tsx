import SettingsForm from "@/components/SettingsForm";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import useModuleStatus from "@/hooks/api/useModuleStatus";
import useChangeModuleState from "@/hooks/api/useChangeModuleState";
import SettingsTitle from "@/components/settings/SettingsTitle";

export default function ManagePagesScreen() {
  const { moduleStatus, queryModuleStatus } = useModuleStatus();
  const { changeSuccessful, changeModuleState } = useChangeModuleState();

  useEffect(() => {
    if (changeSuccessful) queryModuleStatus();
  }, [changeSuccessful]);

  return (
    <SettingsLayout actualSetting="modules">
      <SettingsTitle>Module verwalten</SettingsTitle>

      <SettingsForm>
        <Text>
          Um das System noch zu erweitern gibt es Module, welche optional
          aktiviert werden können und neue Funktionen bieten.
        </Text>
      </SettingsForm>
      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm>
        <View
          style={tw`border rounded-lg border-[${Color.DARK_GRAY}] border-2 px-2 py-1`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-semibold text-2xl opacity-85`}>Print</Text>
            <Button
              color={moduleStatus?.modulePrint ? Color.RED : Color.BLUE}
              onPress={() =>
                changeModuleState("print", !moduleStatus!.modulePrint)
              }
            >
              {moduleStatus?.modulePrint ? "Deaktivieren" : "Aktivieren"}
            </Button>
          </View>
          <Divider type="HORIZONTAL" style={tw`my-1`} />
          <Text>
            Fügt einen Druckknopf hinzu, mit welchem frei konfigurierbare
            Exports erstellt werden können.
          </Text>
        </View>

        <View
          style={tw`border rounded-lg border-[${Color.DARK_GRAY}] border-2 px-2 py-1`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-semibold text-2xl opacity-85`}>Kalender</Text>
            <Button
              color={moduleStatus?.moduleCalendar ? Color.RED : Color.BLUE}
              onPress={() =>
                changeModuleState("calendar", !moduleStatus!.moduleCalendar)
              }
            >
              {moduleStatus?.moduleCalendar ? "Deaktivieren" : "Aktivieren"}
            </Button>
          </View>
          <Divider type="HORIZONTAL" style={tw`my-1`} />
          <Text>
            Fügt einen Kalenderknopf hinzu, mit welchem Kalender Exports
            erstellt werden können.
          </Text>
        </View>
      </SettingsForm>
    </SettingsLayout>
  );
}
