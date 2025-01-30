import tw from "@/tailwind";
import { View } from "react-native";
import Button from "../elements/Button";
import { useEffect } from "react";
import useRequestNewPassword from "@/hooks/api/useRequestNewPassword";
import React from "react";
import CustomText from "../elements/CustomText";

type Props = {
  editUser: APIFullResponseUser;
  closeModal: () => void;
  openNewPasswordModal: () => void;
};

export default function RequestNewPasswordModal({
  closeModal,
  editUser,
  openNewPasswordModal,
}: Props) {
  const { requestNewPassword, successfulPasswordCreation } =
    useRequestNewPassword();

  useEffect(() => {
    if (successfulPasswordCreation) {
      closeModal();
      openNewPasswordModal();
    }
  }, [successfulPasswordCreation]);
  return (
    <>
      <CustomText style={tw`mx-4`}>
        Soll das Passwort von{" "}
        <CustomText
          style={tw`font-semibold`}
        >{`${editUser.firstname} ${editUser.lastname}`}</CustomText>{" "}
        wirklich zurückgesetzt werden?
      </CustomText>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal}>Abbrechen</Button>
        <Button
          onPress={() => {
            requestNewPassword(editUser.id);
          }}
          color="#f67e7e"
        >
          Zurücksetzen
        </Button>
      </View>
    </>
  );
}
