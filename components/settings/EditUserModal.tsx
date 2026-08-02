import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Image from "@/components/elements/Image";
import useRequestVerification from "@/hooks/api/useRequestVerification";

type Props = {
  user: User;
  editUser: APIFullResponseUser;
  closeModal: () => void;
  queryUsers: () => void;
  openRequestPasswordModal: () => void;
  openChangeInformationModal: () => void;
};

const EditUserModal = ({
  user,
  editUser,
  closeModal,
  queryUsers,
  openRequestPasswordModal,
  openChangeInformationModal,
}: Props) => {
  const { requestVerification } = useRequestVerification();

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.55}
        className={`pb-3 pt-1 flex-row items-center mx-4 gap-2 ${
          editUser.id === user.id ? "hidden" : ""
        }`}
        onPress={() => {
          closeModal();
          openRequestPasswordModal();
        }}
      >
        <CustomText className="text-lg font-semibold text-seas-blue">
          Passwort zurücksetzen
        </CustomText>
        <Image
          source={require("@/assets/img/refresh.svg")}
          size={24}
          className="color-seas-blue"
        />
      </TouchableOpacity>
      <Divider
        type="HORIZONTAL"
        className={`mb-1 ${editUser.id === user.id ? "hidden" : ""}`}
      />
      <Pressable
        className={`py-3 flex-row items-center mx-4 gap-2 ${
          editUser.id === user.id ? "hidden" : ""
        }`}
        onPress={() => {
          closeModal();
          openChangeInformationModal();
        }}
      >
        <CustomText className="text-lg font-semibold text-seas-blue">
          Nutzer bearbeiten
        </CustomText>
        <Image
          source={require("@/assets/img/edit.svg")}
          size={24}
          className="color-seas-blue"
        />
      </Pressable>
      <Divider
        type="HORIZONTAL"
        className={`mb-1 ${editUser.id === user.id ? "hidden" : ""}`}
      />
      <Pressable
        className={`py-3 flex-row items-center mx-4 gap-2 ${
          editUser.state !== "UNVERIFIED" &&
          editUser.state !== "VERIFICATION_PENDING"
            ? "hidden"
            : ""
        }`}
        onPress={() => {
          // TODO: refactor to use event driven code (without timeout)
          closeModal();
          requestVerification(editUser.id);
          setTimeout(() => {
            queryUsers();
          }, 1000);
        }}
      >
        <CustomText className="text-lg font-semibold text-seas-blue">
          Verifizierung anfragen
        </CustomText>
        <Image
          source={require("@/assets/img/changepassword.svg")}
          size={24}
          className="color-seas-blue"
        />
      </Pressable>
      <Divider
        type="HORIZONTAL"
        className={`mb-1 ${
          editUser.state !== "UNVERIFIED" &&
          editUser.state !== "VERIFICATION_PENDING"
            ? "hidden"
            : ""
        }`}
      />

      <View className="justify-center flex-row gap-2 my-4">
        <Button onPress={closeModal}>Abbrechen</Button>
      </View>
    </>
  );
};

export default EditUserModal;
