import React from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";

type Props = {
  editUser: APIFullResponseUser;
  closeModal: () => void;
};

export default function NewPasswordModal({ closeModal, editUser }: Props) {
  return (
    <>
      <CustomText className="mx-4">
        Das Passwort von{" "}
        <CustomText className="font-semibold">{`${editUser.firstname} ${editUser.lastname}`}</CustomText>{" "}
        wurde erfolgreich zurück gesetzt.
      </CustomText>
      <CustomText className="mx-4 text-lg">
        Das Mitglied hat eine E-Mail erhalten um ein neues Passwort zu wählen.
      </CustomText>
      <View className="justify-center flex-row gap-2 my-4">
        <Button onPress={closeModal}>Fertig</Button>
      </View>
    </>
  );
}
