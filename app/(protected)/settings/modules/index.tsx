import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

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

export default function ManagePagesScreen() {
  const { moduleStatus, queryModuleStatus } = useModuleStatus();
  const { changeSuccessful, changeModuleState } = useChangeModuleState();
  const { restrictions } = useRestrictions();
  const { t } = useTranslation();

  useEffect(() => {
    if (changeSuccessful) queryModuleStatus();
  }, [changeSuccessful, queryModuleStatus]);

  return (
    <SettingsLayout actualSetting="modules">
      <SettingsTitle t="configureModules" />

      <SettingsForm>
        <CustomText t="modulesDescription" />
      </SettingsForm>
      <Divider type="HORIZONTAL" className="my-4" />

      <Callout
        visible={!restrictions?.modulesManagable}
        message={t("modulesNotManagable")}
      />

      <SettingsForm>
        <View className="rounded-lg border-seas-dark-gray border-2 px-2 py-1">
          <View className="flex-row justify-between items-center">
            <CustomText
              className="font-semibold text-2xl opacity-85"
              t="print"
            />
            <Button
              color={moduleStatus?.modulePrint ? Color.RED : Color.BLUE}
              disabled={!restrictions?.modulesManagable}
              onPress={() =>
                changeModuleState("print", !moduleStatus!.modulePrint)
              }
            >
              {moduleStatus?.modulePrint ? t("deactivate") : t("activate")}
            </Button>
          </View>
          <Divider type="HORIZONTAL" className="my-1" />
          <CustomText t="printDescription" />
        </View>

        <View className="rounded-lg border-seas-dark-gray border-2 px-2 py-1">
          <View className="flex-row justify-between items-center">
            <CustomText
              className="font-semibold text-2xl opacity-85"
              t="calendar"
            />
            <Button
              color={moduleStatus?.moduleCalendar ? Color.RED : Color.BLUE}
              disabled={!restrictions?.modulesManagable}
              onPress={() =>
                changeModuleState("calendar", !moduleStatus!.moduleCalendar)
              }
            >
              {moduleStatus?.moduleCalendar ? t("deactivate") : t("activate")}
            </Button>
          </View>
          <Divider type="HORIZONTAL" className="my-1" />
          <CustomText t="calendarDescription" />
        </View>

        <View className="rounded-lg border-seas-dark-gray border-2 px-2 py-1">
          <View className="flex-row justify-between items-center">
            <CustomText
              className="font-semibold text-2xl opacity-85"
              t="music"
            />
            <Button
              color={moduleStatus?.moduleMusic ? Color.RED : Color.BLUE}
              disabled={!restrictions?.modulesManagable}
              onPress={() =>
                changeModuleState("music", !moduleStatus!.moduleMusic)
              }
            >
              {moduleStatus?.moduleMusic ? t("deactivate") : t("activate")}
            </Button>
          </View>
          <Divider type="HORIZONTAL" className="my-1" />
          <TouchableOpacity
            className="flex-row items-center gap-2 rounded-lg border-seas-dark-gray border-2 px-2 py-1"
            onPress={() => router.navigate("/settings/modules/music/songbooks")}
          >
            <AntDesign name="arrowright" size={24} color="black" />
            <CustomText
              className="font-semibold underline"
              t="manageSongbooks"
            />
          </TouchableOpacity>
          <CustomText className="mt-2" t="musicDescription" />
        </View>
      </SettingsForm>
    </SettingsLayout>
  );
}
