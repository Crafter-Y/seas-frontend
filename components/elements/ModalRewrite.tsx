import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal as RNModal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import tw from "@/tailwind";
import Input from "./Input";
import { ScrollView } from "react-native-gesture-handler";
import Divider from "./Divider";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  title: string;
  children?: React.ReactNode;
  scrollable?: boolean;
};

export type ModalHandle = {
  openModal: () => void;
  closeModal: () => void;
};

const ModalRewrite = forwardRef<ModalHandle, Props>(
  ({ title, children, scrollable = false }: Props, ref) => {
    const [isModalOpen, setModalOpen] = useState(false);

    //#TODO: Animate background to fade in and out

    useImperativeHandle(ref, () => ({
      openModal() {
        setModalOpen(true);
      },
      closeModal() {
        setModalOpen(false);
      },
    }));

    return (
      <RNModal
        visible={isModalOpen}
        statusBarTranslucent
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        {/** Not Good - #TODO: Needs improvement */}
        {scrollable && (
          <View style={tw`bg-zinc-900/40 h-full items-center justify-center`}>
            <ScrollView style={tw.style({ maxHeight: "75%" }, "bg-white")}>
              <Text>{title}</Text>
              <Input placeholder="efaf" onChangeText={() => {}} />
              {children}
            </ScrollView>
          </View>
        )}
        {!scrollable && (
          <Pressable
            style={tw`bg-zinc-900/40 h-full`}
            onPress={() => setModalOpen(false)}
          >
            <KeyboardAvoidingView
              style={tw`items-center justify-center h-full px-2`}
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`bg-white rounded-xl shadow-lg w-full`}>
                  <View
                    style={tw`pl-2 pr-2 py-2 flex-row justify-between items-center`}
                  >
                    <View style={tw`w-10 h-1`}></View>
                    <Text
                      style={tw`text-3xl font-semibold text-black/80 text-center flex-grow`}
                    >
                      {title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalOpen(false)}
                      style={tw`p-2 w-10 rounded-full`}
                    >
                      <AntDesign name="close" size={25} color="gray" />
                    </TouchableOpacity>
                  </View>
                  <Divider type="HORIZONTAL" style={tw`mb-2`} />
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Pressable>
        )}
      </RNModal>
    );
  }
);
ModalRewrite.displayName = "ModalRewrite";
export default ModalRewrite;
