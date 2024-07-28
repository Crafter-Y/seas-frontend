import tw from "@/tailwind";
import { useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { MusicEntryType } from "./MusicEntryTypeModal";

type HistoryType = "GOOD" | "BAD" | "MIN" | "MAX";

export default function MusicHistoryModal() {
  const [searchType, setSearchType] = useState<MusicEntryType>("MISSION");

  const [historyType, setHistoryType] = useState<HistoryType>("GOOD");

  return (
    <View style={tw`mx-2 md:mx-4`}>
      <SegmentedButtons
        value={searchType}
        onValueChange={(text) => setSearchType(text as MusicEntryType)}
        buttons={[
          {
            value: "MISSION",
            label: "Gottesdienst",
          },
          {
            value: "TEST",
            label: "Probe",
          },
        ]}
      />
      <SegmentedButtons
        value={historyType}
        onValueChange={(text) => setHistoryType(text as HistoryType)}
        style={tw`mt-2`}
        buttons={[
          {
            value: "GOOD",
            label: "Gut",
          },
          {
            value: "BAD",
            label: "Schlecht",
          },
          {
            value: "MIN",
            label: "Wenig",
          },
          {
            value: "MAX",
            label: "Oft",
          },
        ]}
      />
    </View>
  );
}
