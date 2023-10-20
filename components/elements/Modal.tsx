import {
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
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
  openModal: () => void;
  closeModal: () => void;
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
        style={tw.style(
          {
            "justify-end": Platform.OS != "web" && type == "MOBILE_BOTTOM",
            "justify-center": Platform.OS == "web" || type == "CENTER",
          },
          "m-0 items-center"
        )}
        swipeDirection={swipeDirection}
        onSwipeComplete={intCloseModal}
        customBackdrop={
          <TouchableOpacity
            style={tw.style(
              {
                height,
                width,
              },
              "bg-opacity-35 bg-black"
            )}
            onPress={intCloseModal}
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
export default memo(Modal);
