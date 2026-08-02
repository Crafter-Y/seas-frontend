import { AntDesign } from "@expo/vector-icons";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import useMediaQueries from "@/hooks/useMediaQueries";

type Props = {
  title: string;
  values?: {
    [name: string]: string;
  };
  children?: React.ReactNode;
  scrollable?: boolean;
};

export type ModalHandle = {
  openModal: () => void;
  closeModal: () => void;
};

type HeaderProps = {
  title: string;
  values?: {
    [name: string]: string;
  };
  closeModal: () => void;
};

const ModalHeader = ({ title, closeModal, values }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <>
      <View className="pl-2 pr-2 py-2 flex-row justify-between items-center">
        <View className="w-10 h-1"></View>
        <CustomText className="text-3xl font-semibold text-black/80 text-center flex-grow max-w-4/5">
          {t(title, values)}
        </CustomText>
        <TouchableOpacity
          onPress={closeModal}
          className="p-2 w-10 rounded-full"
          testID="modal-close-button"
        >
          <AntDesign name="close" size={25} color="gray" />
        </TouchableOpacity>
      </View>
      <Divider type="HORIZONTAL" className="mb-2" />
    </>
  );
};

const ModalRewrite = forwardRef<ModalHandle, Props>(
  ({ title, values, children, scrollable = false }: Props, ref) => {
    const { isSm, isMd, isXl } = useMediaQueries();
    const { height } = useWindowDimensions();

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

    //TODO: Animate background to fade in and out

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
      <RNModal
        visible={isModalOpen}
        statusBarTranslucent
        transparent
        animationType="slide"
        onRequestClose={intCloseModal}
      >
        {/* TODO: Backdrop not working */}
        {scrollable && (
          <View className="bg-zinc-900/40 h-full items-center justify-center px-2">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              className={`bg-white rounded-xl grow-0 ${
                !isSm && !isMd ? "w-full" : ""
              } ${isSm ? "max-w-96" : ""}`}
              style={{
                maxHeight: height * 0.8,
                width: isXl ? 580 : undefined,
              }}
            >
              <ModalHeader
                title={title}
                closeModal={intCloseModal}
                values={values}
              />
              {children}
            </ScrollView>
          </View>
        )}
        {!scrollable && (
          <Pressable className="bg-zinc-900/40 h-full" onPress={intCloseModal}>
            <KeyboardAvoidingView
              className="items-center justify-center h-full px-2"
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback
                onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
              >
                <View
                  className={`bg-white rounded-xl shadow-lg ${
                    !isSm && !isMd ? "w-full" : ""
                  } ${isSm ? "max-w-96" : ""}`}
                  style={{ width: isXl ? 580 : undefined }}
                >
                  <ModalHeader
                    title={title}
                    closeModal={intCloseModal}
                    values={values}
                  />
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Pressable>
        )}
      </RNModal>
    );
  },
);

ModalRewrite.displayName = "ModalRewrite";
export default ModalRewrite;
