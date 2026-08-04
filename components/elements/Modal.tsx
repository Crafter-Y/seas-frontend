import React, { memo, useCallback, useImperativeHandle, useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import ReactNativeModal, { Direction } from "react-native-modal";

import useMediaQueries from "@/hooks/useMediaQueries";

type ModalType = "MOBILE_BOTTOM" | "CENTER";

export type ModalHandle = {
  openModal: () => void;
  closeModal: () => void;
};

type Props = {
  modalOpenCondition?: boolean;
  children?: React.ReactNode;
  type: ModalType;
  swipeDirection?: Direction | Direction[];
  ref?: React.Ref<ModalHandle>;
};

const Modal = ({
  modalOpenCondition = true,
  children,
  type,
  swipeDirection = ["down"],
  ref,
}: Props) => {
  const { height, width } = useWindowDimensions();
  const { isSm } = useMediaQueries();

  const [isModalOpen, setModalOpen] = useState(false);

  // use this to prevent immediate closing of the modal appearing when used in touch mode
  const [lastModalOpen, setLastModalOpen] = useState<Date | null>();

  const intCloseModal = useCallback(() => {
    if (
      lastModalOpen &&
      new Date().getTime() - lastModalOpen.getTime() < 100 // 100ms
    ) {
      return;
    }

    setModalOpen(false);
  }, [lastModalOpen]);

  useImperativeHandle(ref, () => ({
    openModal() {
      setLastModalOpen(new Date());
      setModalOpen(true);
    },
    closeModal() {
      intCloseModal();
    },
  }));

  return (
    <ReactNativeModal
      isVisible={isModalOpen && modalOpenCondition}
      onBackdropPress={intCloseModal}
      className={`m-0 items-center ${
        Platform.OS !== "web" && type === "MOBILE_BOTTOM" ? "justify-end" : ""
      } ${Platform.OS === "web" || type === "CENTER" ? "justify-center" : ""}`}
      swipeDirection={swipeDirection}
      onSwipeComplete={intCloseModal}
      customBackdrop={
        <TouchableOpacity
          className="bg-opacity-35 bg-black"
          style={{ height, width }}
          onPress={intCloseModal}
        ></TouchableOpacity>
      }
    >
      <View style={{ maxHeight: height * 0.8 }}>
        <ScrollView
          nestedScrollEnabled={true}
          decelerationRate={0.5}
          className={`bg-white shadow-lg ${
            Platform.OS === "web" ? "w-1/2 rounded-md" : ""
          } ${
            Platform.OS === "android" && type === "MOBILE_BOTTOM"
              ? "rounded-t-xl"
              : ""
          }`}
          style={{
            flexGrow: 0,
            width:
              Platform.OS === "web" ? (isSm ? width / 2 : width * 0.75) : width,
          }}
        >
          {children}
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
};

Modal.displayName = "Modal";
export default memo(Modal);
