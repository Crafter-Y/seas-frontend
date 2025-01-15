import { View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import Button from "../elements/Button";
import CustomText from "../elements/CustomText";

type Props = {
  editUser: APIFullResponseUser;
  closeModal?: () => void;
};

export default function NewPasswordModal({ closeModal, editUser }: Props) {
  return (
    <>
      <CustomText style={tw`mx-4`}>
        Das Passwort von{" "}
        <CustomText
          style={tw`font-semibold`}
        >{`${editUser.firstname} ${editUser.lastname}`}</CustomText>{" "}
        wurde erfolgreich zurück gesetzt.
      </CustomText>
      <CustomText style={tw`mx-4 text-lg`}>
        Das Mitglied hat eine E-Mail erhalten um ein neues Passwort zu wählen.
      </CustomText>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal}>Fertig</Button>
      </View>
    </>
  );
}
