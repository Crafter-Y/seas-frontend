import Modal, { ModalHandle } from "@/components/elements/Modal";
import tw from "@/tailwind";
import { Text, View } from "react-native";
import Button from "@/components/elements/Button";
import { forwardRef, MutableRefObject } from "react";

type Props = {
  reactivateUser: () => void;
  clearInputs: () => void;
};

const ReactivateUserModal = forwardRef<ModalHandle, Props>(
  ({ reactivateUser, clearInputs }: Props, ref) => {
    return (
      <Modal type="CENTER" ref={ref}>
        <Text
          style={tw`text-center text-2xl mt-6 px-4 font-semibold underline`}
        >
          Benutzer neu aktivieren?
        </Text>
        <View style={tw`px-4 mt-4 gap-2`}>
          <Text>
            Ein ehemaliger Mitglied mit dieser Email Adresse existierte bereits.
            Wenn dieser erneut aktiviert wird, bleiben alle ehemaligen
            Eintragungen unter neuem Namen bestehen.
          </Text>
          <Text>Soll dieser Nutzer neu aktiviert werden?</Text>
        </View>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              reactivateUser();
              (ref as MutableRefObject<ModalHandle>).current.closeModal();
            }}
            color="#f67e7e"
          >
            Ja
          </Button>
          <Button
            onPress={() => {
              (ref as MutableRefObject<ModalHandle>).current.closeModal();
              clearInputs();
            }}
          >
            Nein
          </Button>
        </View>
      </Modal>
    );
  }
);

ReactivateUserModal.displayName = "ReactivateUserModal";
export default ReactivateUserModal;
