import { Text, View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import Button from "../elements/Button";

type Props = {
  editUser: APIFullResponseUser;
  closeModal?: () => void;
};

export default function NewPasswordModal({ closeModal, editUser }: Props) {
  return (
    <>
      <Text style={tw`mx-4`}>
        Das Passwort von{" "}
        <Text
          style={tw`font-semibold`}
        >{`${editUser.firstname} ${editUser.lastname}`}</Text>{" "}
        wurde erfolgreich zurück gesetzt.
      </Text>
      <Text style={tw`mx-4 text-lg`}>
        Das Mitglied hat eine E-Mail erhalten um ein neues Passwort zu wählen.
      </Text>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal}>Fertig</Button>
      </View>
    </>
  );
}
