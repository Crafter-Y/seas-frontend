import tw from "@/tailwind";
import { Text, View } from "react-native";
import Button from "../elements/Button";
import { Color } from "@/helpers/Constants";
import { useEffect } from "react";
import useDeleteUser from "@/hooks/api/useDeleteUser";

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
      <Text style={tw`mx-4`}>
        Soll das Mitglied{" "}
        <Text
          style={tw`font-semibold`}
        >{`${editUser.firstname} ${editUser.lastname}`}</Text>{" "}
        wirklich glöscht werden?
      </Text>
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
