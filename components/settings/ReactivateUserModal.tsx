import { RefObject } from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Modal, { ModalHandle } from "@/components/elements/Modal";

type Props = {
  reactivateUser: () => void;
  clearInputs: () => void;
  ref?: RefObject<ModalHandle | null>;
};

const ReactivateUserModal = ({ reactivateUser, clearInputs, ref }: Props) => {
  return (
    <Modal type="CENTER" ref={ref}>
      <CustomText className="text-center text-2xl mt-6 px-4 font-semibold underline">
        Benutzer neu aktivieren?
      </CustomText>
      <View className="px-4 mt-4 gap-2">
        <CustomText>
          Ein ehemaliger Mitglied mit dieser Email Adresse existierte bereits.
          Wenn dieser erneut aktiviert wird, bleiben alle ehemaligen
          Eintragungen unter neuem Namen bestehen.
        </CustomText>
        <CustomText>Soll dieser Nutzer neu aktiviert werden?</CustomText>
      </View>
      <View className="justify-center flex-row gap-2 my-4">
        <Button
          onPress={() => {
            reactivateUser();
            ref?.current?.closeModal();
          }}
          color="#f67e7e"
        >
          Ja
        </Button>
        <Button
          onPress={() => {
            ref?.current?.closeModal();
            clearInputs();
          }}
        >
          Nein
        </Button>
      </View>
    </Modal>
  );
};

ReactivateUserModal.displayName = "ReactivateUserModal";
export default ReactivateUserModal;
