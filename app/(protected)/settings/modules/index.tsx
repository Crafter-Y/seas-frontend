import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Button from "@/components/elements/Button";
import Callout from "@/components/elements/Callout";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import { Color } from "@/helpers/Constants";
import useChangeModuleState from "@/hooks/api/useChangeModuleState";
import useModuleStatus from "@/hooks/api/useModuleStatus";
import useRestrictions from "@/hooks/api/useRestrictions";
import tw from "@/tailwind";

export default function ManagePagesScreen() {
  const { moduleStatus, queryModuleStatus } = useModuleStatus();
  const { changeSuccessful, changeModuleState } = useChangeModuleState();
  const { restrictions } = useRestrictions();

  useEffect(() => {
    if (changeSuccessful) queryModuleStatus();
  }, [changeSuccessful, queryModuleStatus]);

  return (
    <SettingsLayout actualSetting="modules" backTitle="Zurück">
      <SettingsTitle>Module verwalten</SettingsTitle>

      <SettingsForm>
        <CustomText>
          Um das System noch zu erweitern gibt es Module, welche optional
          aktiviert werden können und neue Funktionen bieten.
        </CustomText>
      </SettingsForm>
      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <Callout
        visible={!restrictions?.modulesManagable}
        message="Module können in Ihrem Produkt nicht manuell aktiviert/deaktiviert werden."
      />

      <SettingsForm>
        <View
          style={tw`border rounded-lg border-[${Color.DARK_GRAY}] border-2 px-2 py-1`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <CustomText style={tw`font-semibold text-2xl opacity-85`}>
              Print
            </CustomText>
            <Button
              color={moduleStatus?.modulePrint ? Color.RED : Color.BLUE}
              disabled={!restrictions?.modulesManagable}
              onPress={() =>
                changeModuleState("print", !moduleStatus!.modulePrint)
              }
            >
              {moduleStatus?.modulePrint ? "Deaktivieren" : "Aktivieren"}
            </Button>
          </View>
          <Divider type="HORIZONTAL" style={tw`my-1`} />
          <CustomText>
            Fügt einen Druckknopf hinzu, mit welchem frei konfigurierbare
            Exports erstellt werden können.
          </CustomText>
        </View>

        <View
          style={tw`border rounded-lg border-[${Color.DARK_GRAY}] border-2 px-2 py-1`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <CustomText style={tw`font-semibold text-2xl opacity-85`}>
              Kalender
            </CustomText>
            <Button
              color={moduleStatus?.moduleCalendar ? Color.RED : Color.BLUE}
              disabled={!restrictions?.modulesManagable}
              onPress={() =>
                changeModuleState("calendar", !moduleStatus!.moduleCalendar)
              }
            >
              {moduleStatus?.moduleCalendar ? "Deaktivieren" : "Aktivieren"}
            </Button>
          </View>
          <Divider type="HORIZONTAL" style={tw`my-1`} />
          <CustomText>
            Fügt einen Kalenderknopf hinzu, mit welchem Kalender Exports
            erstellt werden können.
          </CustomText>
        </View>

        <View
          style={tw`border rounded-lg border-[${Color.DARK_GRAY}] border-2 px-2 py-1`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <CustomText style={tw`font-semibold text-2xl opacity-85`}>
              Musik
            </CustomText>
            <Button
              color={moduleStatus?.moduleMusic ? Color.RED : Color.BLUE}
              disabled={!restrictions?.modulesManagable}
              onPress={() =>
                changeModuleState("music", !moduleStatus!.moduleMusic)
              }
            >
              {moduleStatus?.moduleMusic ? "Deaktivieren" : "Aktivieren"}
            </Button>
          </View>
          <Divider type="HORIZONTAL" style={tw`my-1`} />
          <TouchableOpacity
            style={tw`flex-row items-center gap-2 rounded-lg border-[${Color.DARK_GRAY}] border-2 px-2 py-1`}
            onPress={() => router.navigate("/settings/modules/music/songbooks")}
          >
            <AntDesign name="arrowright" size={24} color="black" />
            <CustomText style={tw`font-semibold underline`}>
              Chorlisten verwalten
            </CustomText>
          </TouchableOpacity>
          <CustomText style={tw`mt-2`}>
            Ermöglicht das dokumentieren und auswerten von Choraktivitäten.
          </CustomText>
        </View>
      </SettingsForm>
    </SettingsLayout>
  );
}
