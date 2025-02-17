import { AntDesign } from "@expo/vector-icons";
import {
  Picker as RNPicker,
  PickerItemProps,
} from "@react-native-picker/picker";
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform, Pressable, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import tw from "@/tailwind";

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

  const [selectionCount, setSelectionCount] = useState(0);

  const getAllPickerProps = useCallback(() => {
    return children
      .filter((child) => React.isValidElement(child))
      .map((child) => {
        const ch = child as ReactElement;
        return ch.props as PickerItemProps;
      });
  }, [children]);

  const getParamValue = (key: string) => {
    return (
      getAllPickerProps().filter((prop) => prop.value === key)[0]?.label ??
      undefined
    );
  };

  useEffect(() => {
    setSelectionCount(getAllPickerProps().length);
  }, [children, getAllPickerProps]);

  if (Platform.OS === "ios")
    return (
      <View>
        <Pressable
          disabled={disabled}
          onPress={() => {
            if (selectionCount > 1) {
              setIosPickerOpen(true);
              iosModal.current?.openModal();
            }
          }}
          style={tw.style(
            "border border-black border-opacity-20 rounded-xl justify-between flex-row items-center h-13 pl-4 pr-5",
          )}
        >
          <CustomText style={tw.style({}, "text-lg")}>
            {selectionCount === 1
              ? getAllPickerProps()[0].label
              : getParamValue(selectedValue)}
          </CustomText>
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

          "rounded-xl px-2 bg-transparent py-1",
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
