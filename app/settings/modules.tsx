import SettingsForm from "@/components/SettingsForm";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import H2 from "@/components/elements/H2";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import { Color } from "@/helpers/Constants";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";
import React from "react";
import { Text, View } from "react-native";
import useModuleStatus from "@/hooks/api/useModuleStatus";

export default function ManagePagesScreen() {
    const { isMd } = useMediaQueries();

    const { moduleStatus, queryModuleStatus } = useModuleStatus()

    return (
        <SettingsLayout actualSetting="modules">
            <H2
                style={tw.style(
                    {
                        "text-center": !isMd,
                    },
                    "mt-4"
                )}
            >
                Module verwalten
            </H2>

            <SettingsForm>
                <Text>
                    Um das System noch zu erweitern gibt es Module, welche optional aktiviert werden können und neue Funktionen bieten.
                </Text>
            </SettingsForm>
            <Divider type="HORIZONTAL" style={tw`my-4`} />

            <SettingsForm>
                <View style={tw`border rounded-lg border-[${Color.DARK_GRAY}] border-2 px-2 py-1`}>
                    <View style={tw`flex-row justify-between items-center`}>
                        <Text style={tw`font-semibold text-2xl opacity-85`}>Print</Text>
                        <Button color={moduleStatus?.modulePrint ? Color.RED : Color.BLUE}>
                            {moduleStatus?.modulePrint ? "Deaktivieren" : "Aktivieren"}
                        </Button>
                    </View>

                    <Divider type="HORIZONTAL" style={tw`my-1`} />
                    <Text>Fügt einen Druckknopf hinzu, mit welchem frei konfigurierbare Exports erstellt werden können.</Text>
                </View>
            </SettingsForm>
        </SettingsLayout>
    );
};