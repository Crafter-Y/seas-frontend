import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Image from "@/components/elements/Image";
import { Color } from "@/helpers/Constants";
import useRequestVerification from "@/hooks/api/useRequestVerification";
import tw from "@/tailwind";

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
        style={tw.style(
          {
            hidden: editUser.id === user.id,
          },
          "pb-3 pt-1 flex-row items-center mx-4 gap-2",
        )}
        onPress={() => {
          closeModal();
          openRequestPasswordModal();
        }}
      >
        <CustomText
          style={tw.style("text-lg font-semibold", {
            color: Color.BLUE,
          })}
        >
          Passwort zurücksetzen
        </CustomText>
        <Image
          source={require("@/assets/img/refresh.svg")}
          size={24}
          style={{ color: Color.BLUE }}
        />
      </TouchableOpacity>
      <Divider
        type="HORIZONTAL"
        style={tw.style(
          {
            hidden: editUser.id === user.id,
          },
          "mb-1",
        )}
      />
      <Pressable
        style={tw.style(
          {
            hidden: editUser.id === user.id,
          },
          "py-3 flex-row items-center mx-4 gap-2",
        )}
        onPress={() => {
          closeModal();
          openChangeInformationModal();
        }}
      >
        <CustomText
          style={tw.style("text-lg font-semibold", {
            color: Color.BLUE,
          })}
        >
          Nutzer bearbeiten
        </CustomText>
        <Image
          source={require("@/assets/img/edit.svg")}
          size={24}
          style={{ color: Color.BLUE }}
        />
      </Pressable>
      <Divider
        type="HORIZONTAL"
        style={tw.style(
          {
            hidden: editUser.id === user.id,
          },
          "mb-1",
        )}
      />
      <Pressable
        style={tw.style(
          {
            hidden:
              editUser.state !== "UNVERIFIED" &&
              editUser.state !== "VERIFICATION_PENDING",
          },
          "py-3 flex-row items-center mx-4 gap-2",
        )}
        onPress={() => {
          // TODO: refactor to use event driven code (without timeout)
          closeModal();
          requestVerification(editUser.id);
          setTimeout(() => {
            queryUsers();
          }, 1000);
        }}
      >
        <CustomText
          style={tw.style("text-lg font-semibold", {
            color: Color.BLUE,
          })}
        >
          Verifizierung anfragen
        </CustomText>
        <Image
          source={require("@/assets/img/changepassword.svg")}
          size={24}
          style={{ color: Color.BLUE }}
        />
      </Pressable>
      <Divider
        type="HORIZONTAL"
        style={tw.style(
          {
            hidden:
              editUser.state !== "UNVERIFIED" &&
              editUser.state !== "VERIFICATION_PENDING",
          },
          "mb-1",
        )}
      />

      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal}>Abbrechen</Button>
      </View>
    </>
  );
};

export default EditUserModal;
