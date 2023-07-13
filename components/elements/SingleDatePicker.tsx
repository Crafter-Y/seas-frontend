import { View, Text, Platform, Pressable } from "react-native";
import React, { useState } from "react";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { DatePickerModal } from "react-native-paper-dates";
import tw from "@/tailwind";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  setDate: (date: CalendarDate) => void;
};

const SingleDatePicker = ({ setDate }: Props) => {
  const [date, setInternalDate] = useState<CalendarDate>(undefined);
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => {
          setOpen(true);
        }}
        style={tw.style(
          {
            "h-13": Platform.OS != "web",
            "pl-4": Platform.OS != "web",
            "pr-5": Platform.OS != "web",
            "pl-2": Platform.OS == "web",
            "py-0.5": Platform.OS == "web",
            "pr-1": Platform.OS == "web",
          },
          "border border-black border-opacity-20 rounded-xl justify-between flex-row items-center"
        )}
      >
        <Text style={tw.style({}, `text-lg`)}>
          {!!date ? date?.toLocaleDateString() : "Datum auswählen"}
        </Text>
        <AntDesign name="caretdown" size={10} color="gray" />
      </Pressable>
      <DatePickerModal
        startYear={2023}
        endYear={2050}
        locale="de"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setInternalDate(date.date);
          setDate(date.date);
        }}
      />
    </View>
  );
};

export default SingleDatePicker;
