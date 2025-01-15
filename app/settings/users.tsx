import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import tw from "@/tailwind";
import SettingsForm from "@/components/SettingsForm";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import TH from "@/components/elements/TH";
import useAllUsers from "@/hooks/api/useAllUsers";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import Form from "@/components/elements/Form";
import useAuthentication from "@/hooks/api/useAuthentication";
import Image from "@/components/elements/Image";
import { toUpperStarting } from "@/helpers/format";
import SettingsTitle from "@/components/settings/SettingsTitle";
import CreateUserForm from "@/components/settings/CreateUserForm";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import EditUserModal from "@/components/settings/EditUserModal";
import ChangeUserInformationModal from "@/components/settings/ChangeUserInformationModal";
import DeleteUserModal from "@/components/settings/DeleteUserModal";
import RequestNewPasswordModal from "@/components/settings/RequestNewPasswordModal";
import NewPasswordModal from "@/components/settings/NewPasswordModal";
import useRestrictions from "@/hooks/api/useRestrictions";
import CustomText from "@/components/elements/CustomText";

export default function ManageUsersScreen() {
  const { user } = useAuthentication();

  const { allUsers, queryUsers } = useAllUsers();
  const { restrictions } = useRestrictions();

  const [maxUsersReached, setMaxUsersReached] = useState(false);
  const [maxAdminsReached, setMaxAdminsReached] = useState(false);

  const [editUser, setEditUser] = useState<APIFullResponseUser>();

  const editModal = useRef<ModalHandle>(null);
  const changeInformationModal = useRef<ModalHandle>(null);
  const deleteUserModal = useRef<ModalHandle>(null);
  const requestNewPasswordModal = useRef<ModalHandle>(null);
  const newPasswordModal = useRef<ModalHandle>(null);

  useEffect(() => {
    if (
      restrictions &&
      allUsers &&
      restrictions.maxUsers <=
        allUsers.filter((user) => user.role == "USER").length
    ) {
      setMaxUsersReached(true);
    }
    if (
      restrictions &&
      allUsers &&
      restrictions.maxAdmins <=
        allUsers.filter((user) => user.role == "ADMIN").length
    ) {
      setMaxAdminsReached(true);
    }
  }, [restrictions, allUsers]);

  return (
    <SettingsLayout actualSetting="users">
      <SettingsTitle>Nutzer erstellen</SettingsTitle>

      <CreateUserForm
        queryUsers={queryUsers}
        maxUsersReached={maxUsersReached}
        maxAdminsReached={maxAdminsReached}
      />

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Mitglieder", ""]}></TH>
          {allUsers.map((entry) => (
            <TR key={entry.id}>
              <TD cols={2}>
                <CustomText style={tw`text-lg`}>
                  {entry.firstname} {entry.lastname}
                </CustomText>
                <CustomText
                  style={tw.style({
                    hidden: entry.email == "root",
                  })}
                >
                  {entry.email}
                </CustomText>
                <View style={tw`flex-row gap-1`}>
                  <CustomText style={tw`border rounded-full px-1 py-0.5`}>
                    {toUpperStarting(entry.role)}
                  </CustomText>
                  <CustomText
                    style={tw.style(
                      {
                        hidden: entry.email == "root",
                      },
                      "border rounded-full px-1 py-0.5"
                    )}
                  >
                    {toUpperStarting(entry.state)}
                  </CustomText>
                </View>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={2}>
                {entry.email != "root" && entry.id != user?.id && (
                  <Button
                    color="#f67e7e"
                    style={tw`p-2.5`}
                    onPress={() => {
                      setEditUser(entry);
                      deleteUserModal.current?.openModal();
                    }}
                  >
                    <Image
                      source={require("@/assets/img/close.svg")}
                      size={24}
                    />
                  </Button>
                )}
                {entry.email != "root" &&
                  (entry.id != user?.id ||
                    entry.state == "UNVERIFIED" ||
                    entry.state == "VERIFICATION_PENDING") && (
                    <Button
                      style={tw`p-2.5`}
                      onPress={() => {
                        setEditUser(entry);
                        editModal.current?.openModal();
                      }}
                    >
                      <Image
                        source={require("@/assets/img/edit.svg")}
                        size={24}
                      />
                    </Button>
                  )}
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <ModalRewrite title="modal.users.editUser" ref={editModal}>
        <EditUserModal
          user={user!}
          editUser={editUser!}
          closeModal={() => editModal.current?.closeModal()}
          queryUsers={queryUsers}
          openRequestPasswordModal={() =>
            requestNewPasswordModal.current?.openModal()
          }
          openChangeInformationModal={() =>
            changeInformationModal.current?.openModal()
          }
        />
      </ModalRewrite>

      <ModalRewrite
        title="modal.users.editUserInformation"
        values={{ id: editUser?.id + "" }}
        ref={changeInformationModal}
      >
        <ChangeUserInformationModal
          editUser={editUser!}
          queryUsers={queryUsers}
          maxUsersReached={maxUsersReached}
          maxAdminsReached={maxAdminsReached}
          closeModal={() => changeInformationModal.current?.closeModal()}
        />
      </ModalRewrite>

      <ModalRewrite title="modal.users.deleteUser" ref={deleteUserModal}>
        <DeleteUserModal
          editUser={editUser!}
          queryUsers={queryUsers}
          closeModal={() => deleteUserModal.current?.closeModal()}
        />
      </ModalRewrite>

      <ModalRewrite
        title="modal.users.resetPassword"
        ref={requestNewPasswordModal}
      >
        <RequestNewPasswordModal
          editUser={editUser!}
          closeModal={() => requestNewPasswordModal.current?.closeModal()}
          openNewPasswordModal={() => newPasswordModal.current?.openModal()}
        />
      </ModalRewrite>

      <ModalRewrite
        title="modal.users.newPasswordRequested"
        ref={newPasswordModal}
      >
        <NewPasswordModal
          editUser={editUser!}
          closeModal={() => newPasswordModal.current?.closeModal()}
        />
      </ModalRewrite>
    </SettingsLayout>
  );
}
