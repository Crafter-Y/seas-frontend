import { useEffect } from "react";
import React from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import useDeleteUser from "@/hooks/api/useDeleteUser";
import tw from "@/tailwind";

type Props = {
  editUser: APIFullResponseUser;
  closeModal: () => void;
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
      queryUsers();
      closeModal();
    }
    // TODO: including queryUsers and closeModal causes 6 invocations of queryUsers instead of one
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
