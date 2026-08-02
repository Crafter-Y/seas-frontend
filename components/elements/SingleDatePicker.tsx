import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

import CustomText from "@/components/elements/CustomText";

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
        // NOTE: `h-13` is not on Tailwind's default spacing scale, so it was
        // already a no-op under twrnc. Kept verbatim rather than silently
        // changing the height — see the Step 2 notes in EXPO-UPGRADE-PLAN.md.
        className={`border border-black border-opacity-20 rounded-xl justify-between flex-row items-center ${
          Platform.OS !== "web" ? "h-13 pl-4 pr-5" : "pl-2 py-0.5 pr-1"
        }`}
      >
        <CustomText className="text-lg">
          {date ? date?.toLocaleDateString() : "Datum auswählen"}
        </CustomText>
        <AntDesign name="caret-down" size={10} color="gray" />
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
