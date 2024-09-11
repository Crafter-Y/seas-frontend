import { Platform, Pressable, Text, View } from "react-native";
import React, { ReactElement, ReactNode, useRef, useState } from "react";
import tw from "@/tailwind";
import {
  PickerItemProps,
  Picker as RNPicker,
} from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import Modal, { ModalHandle } from "./Modal";

type Props = {
  selectedValue: string;
  onValueChange: (item: string) => void;
  children: ReactNode[];
  disabled?: boolean;
};

const Picker = ({
  selectedValue,
  onValueChange,
  children,
  disabled,
}: Props) => {
  const [iosPickerOpen, setIosPickerOpen] = useState(false);
  const iosModal = useRef<ModalHandle>(null);
  const iosPicker = useRef<RNPicker<string>>(null);

  const getParamValue = (key: string) => {
    return children
      .filter((child) => React.isValidElement(child))
      .map((child) => {
        const ch = child as ReactElement;
        return ch.props as PickerItemProps;
      })
      .filter((prop) => prop.value == key)[0].label;
  };

  if (Platform.OS == "ios")
    return (
      <View>
        <Pressable
          disabled={disabled}
          onPress={() => {
            setIosPickerOpen(true);
            iosModal.current?.openModal();
          }}
          style={tw.style(
            "border border-black border-opacity-20 rounded-xl justify-between flex-row items-center h-13 pl-4 pr-5"
          )}
        >
          <Text style={tw.style({}, "text-lg")}>
            {getParamValue(selectedValue)}
          </Text>
          <AntDesign name="caretdown" size={10} color="gray" />
        </Pressable>
        <Modal
          ref={iosModal}
          modalOpenCondition={iosPickerOpen}
          type="CENTER"
          swipeDirection={[]}
        >
          <RNPicker
            ref={iosPicker}
            selectedValue={selectedValue}
            onValueChange={onValueChange}
          >
            {children}
          </RNPicker>
        </Modal>
      </View>
    );

  return (
    <View style={tw.style("border border-black border-opacity-20 rounded-xl")}>
      <RNPicker
        aria-disabled={disabled}
        style={tw.style(
          {
            fontSize: 18,
            border: "none",
          },

          "rounded-xl px-2 bg-transparent py-1"
        )}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {children}
      </RNPicker>
    </View>
  );
};

export default Picker;
