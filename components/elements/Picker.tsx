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
          className="border border-black border-opacity-20 rounded-xl justify-between flex-row items-center h-13 pl-4 pr-5"
        >
          <CustomText className="text-lg">
            {selectionCount === 1
              ? getAllPickerProps()[0].label
              : getParamValue(selectedValue)}
          </CustomText>
          <AntDesign name="caret-down" size={10} color="gray" />
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
    <View className="border border-black border-opacity-20 rounded-xl">
      <RNPicker
        aria-disabled={disabled}
        // was the web-only CSS shorthand `border: "none"` under twrnc, which is
        // not a valid React Native style key; borderWidth: 0 is the equivalent
        className="rounded-xl px-2 bg-transparent py-1 text-lg"
        style={{ borderWidth: 0 }}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {children}
      </RNPicker>
    </View>
  );
};

export default Picker;
