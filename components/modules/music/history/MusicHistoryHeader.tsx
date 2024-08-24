import { View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";
import { MusicEntryType } from "../MusicEntryTypeModal";
import tw from "@/tailwind";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { HistoryType } from "../MusicHistoryModal";

type Props = {
  setSearchType: (text: MusicEntryType) => void;
  searchType: MusicEntryType;
  setHistoryType: (text: HistoryType) => void;
  historyType: HistoryType;
};

export default function MusicHistoryHeader({
  setSearchType,
  searchType,
  setHistoryType,
  historyType,
}: Props) {
  return (
    <>
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
      <View style={tw`mt-2`}>
        <Button
          mode="outlined"
          textColor="black"
          rippleColor="#e3e3e4"
          buttonColor={historyType == "HISTORY" ? "#e8def8" : undefined}
          onPress={() => setHistoryType("HISTORY")}
          icon={({ size, color }) => (
            <AntDesign name="book" size={size} color={color} />
          )}
          labelStyle={{ marginVertical: 9 }}
          style={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          Historie
        </Button>

        <SegmentedButtons
          value={historyType}
          onValueChange={(text) => setHistoryType(text as HistoryType)}
          buttons={[
            {
              value: "GOOD",
              label: "Gut",
              icon: ({ size, color }) => (
                <AntDesign name="check" size={size} color={color} />
              ),
              style: {
                borderRadius: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
              },
            },
            {
              value: "BAD",
              label: "Schlecht",
              icon: ({ size, color }) => (
                <AntDesign name="close" size={size} color={color} />
              ),
              style: {
                borderRadius: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
              },
            },
          ]}
        />
        <SegmentedButtons
          value={historyType}
          onValueChange={(text) => setHistoryType(text as HistoryType)}
          buttons={[
            {
              value: "MAX",
              label: "Oft",
              icon: ({ size, color }) => (
                <Ionicons name="trending-up" size={size} color={color} />
              ),
              style: {
                borderRadius: 0,
                borderBottomWidth: 0,
              },
            },
            {
              value: "MIN",
              label: "Wenig",
              icon: ({ size, color }) => (
                <Ionicons name="trending-down" size={size} color={color} />
              ),
              style: {
                borderRadius: 0,
                borderBottomWidth: 0,
              },
            },
          ]}
        />
        <SegmentedButtons
          value={historyType}
          onValueChange={(text) => setHistoryType(text as HistoryType)}
          buttons={[
            {
              value: "KNOWN",
              label: "Bekannt",
              icon: ({ size, color }) => (
                <AntDesign name="info" size={size} color={color} />
              ),
              style: {
                borderTopLeftRadius: 0,
              },
            },
            {
              value: "UNKNOWN",
              label: "Unbekannt",
              icon: ({ size, color }) => (
                <AntDesign name="question" size={size} color={color} />
              ),
              style: {
                borderTopRightRadius: 0,
              },
            },
          ]}
        />
      </View>
    </>
  );
}
