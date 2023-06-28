import {
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import ReactNativeModal from "react-native-modal";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";

type ModalType = "MOBILE_BOTTOM" | "CENTER";

type Props = {
  modalOpenCondition?: boolean;
  children?: React.ReactNode;
  type: ModalType;
};

export type ModalHandle = {
  toggleModal: () => void;
};

export default forwardRef<ModalHandle, Props>(
  ({ modalOpenCondition = true, children, type }: Props, ref) => {
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
        swipeDirection={["down"]}
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
        <View
          style={tw.style(
            {
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
            `bg-white shadow-lg`
          )}
        >
          {children}
        </View>
      </ReactNativeModal>
    );
  }
);
