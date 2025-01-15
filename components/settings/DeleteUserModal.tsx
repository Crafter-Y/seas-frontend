import tw from "@/tailwind";
import { View } from "react-native";
import Button from "../elements/Button";
import { Color } from "@/helpers/Constants";
import { useEffect } from "react";
import useDeleteUser from "@/hooks/api/useDeleteUser";
import React from "react";
import CustomText from "../elements/CustomText";

type Props = {
  editUser: APIFullResponseUser;
  closeModal?: () => void;
  queryUsers: () => void;
};

export default function DeleteUserModal({
  closeModal,
  editUser,
  queryUsers,
}: Props) {
  const { deleteUser, succesfulDeletion } = useDeleteUser();

  useEffect(() => {
    if (succesfulDeletion) {
      queryUsers?.();
      closeModal?.();
    }
  }, [succesfulDeletion]);
  return (
    <>
      <CustomText style={tw`mx-4`}>
        Soll das Mitglied{" "}
        <CustomText
          style={tw`font-semibold`}
        >{`${editUser.firstname} ${editUser.lastname}`}</CustomText>{" "}
        wirklich glöscht werden?
      </CustomText>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal}>Abbrechen</Button>
        <Button
          onPress={() => {
            deleteUser(editUser.id);
          }}
          color={Color.RED}
        >
          Löschen
        </Button>
      </View>
    </>
  );
}
