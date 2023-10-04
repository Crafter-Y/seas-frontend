import {
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import ReactNativeModal, { Direction } from "react-native-modal";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";

type ModalType = "MOBILE_BOTTOM" | "CENTER";

type Props = {
  modalOpenCondition?: boolean;
  children?: React.ReactNode;
  type: ModalType;
  swipeDirection?: Direction | Direction[];
};

export type ModalHandle = {
  toggleModal: () => void;
};

const Modal = forwardRef<ModalHandle, Props>(
  (
    {
      modalOpenCondition = true,
      children,
      type,
      swipeDirection = ["down"],
    }: Props,
    ref
  ) => {
    const { height, width } = useWindowDimensions();
    const { isSm } = useMediaQueries();

    const [isModalOpen, setModalOpen] = useState(false);

    const intToggleModal = () => {
      setModalOpen(!isModalOpen);
    };

    useImperativeHandle(ref, () => ({
      toggleModal() {
        intToggleModal();
      },
    }));

    return (
      <ReactNativeModal
        isVisible={isModalOpen && modalOpenCondition}
        onBackdropPress={intToggleModal}
        style={tw.style(
          {
            "justify-end": Platform.OS != "web" && type == "MOBILE_BOTTOM",
            "justify-center": Platform.OS == "web" || type == "CENTER",
          },
          "m-0 items-center"
        )}
        swipeDirection={swipeDirection}
        onSwipeComplete={intToggleModal}
        customBackdrop={
          <TouchableOpacity
            style={tw.style(
              {
                height,
                width,
              },
              "bg-opacity-35 bg-black"
            )}
            onPress={intToggleModal}
          ></TouchableOpacity>
        }
      >
        <View style={tw.style({ maxHeight: height * 0.8 })}>
          <ScrollView
            nestedScrollEnabled={true}
            decelerationRate={0.5}
            style={tw.style(
              {
                flexGrow: 0,
                "w-1/2": Platform.OS == "web",
                "rounded-md": Platform.OS == "web" || type == "MOBILE_BOTTOM",
                "rounded-t-xl": Platform.OS != "web" && type == "MOBILE_BOTTOM",
                width:
                  Platform.OS == "web"
                    ? isSm
                      ? width / 2
                      : width * 0.75
                    : width,
              },
              "bg-white shadow-lg"
            )}
          >
            {children}
          </ScrollView>
        </View>
      </ReactNativeModal>
    );
  }
);

Modal.displayName = "Modal";
export default Modal;
