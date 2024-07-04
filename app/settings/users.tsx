import { Text, View } from "react-native";
import React, { useRef, useState } from "react";
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

export default function ManageUsersScreen() {
  const { user } = useAuthentication();

  const { allUsers, queryUsers } = useAllUsers();

  const [editUser, setEditUser] = useState<APIFullResponseUser>();

  const editModal = useRef<ModalHandle>(null);
  const changeInformationModal = useRef<ModalHandle>(null);
  const deleteUserModal = useRef<ModalHandle>(null);
  const requestNewPasswordModal = useRef<ModalHandle>(null);
  const newPasswordModal = useRef<ModalHandle>(null);

  return (
    <SettingsLayout actualSetting="users">
      <SettingsTitle>Nutzer erstellen</SettingsTitle>

      <CreateUserForm queryUsers={queryUsers} />

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Mitglieder", ""]}></TH>
          {allUsers.map((entry) => (
            <TR key={entry.id}>
              <TD cols={2}>
                <Text style={tw`text-lg`}>
                  {entry.firstname} {entry.lastname}
                </Text>
                <Text
                  style={tw.style({
                    hidden: entry.email == "root",
                  })}
                >
                  {entry.email}
                </Text>
                <View style={tw`flex-row gap-1`}>
                  <Text style={tw`border rounded-full px-1 py-0.5`}>
                    {toUpperStarting(entry.role)}
                  </Text>
                  <Text
                    style={tw.style(
                      {
                        hidden: entry.email == "root",
                      },
                      "border rounded-full px-1 py-0.5"
                    )}
                  >
                    {toUpperStarting(entry.state)}
                  </Text>
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

      <ModalRewrite title="Mitglied bearbeiten" ref={editModal}>
        <EditUserModal
          user={user!}
          editUser={editUser!}
          closeModal={editModal.current?.closeModal}
          queryUsers={queryUsers}
          openRequestPasswordModal={requestNewPasswordModal.current?.openModal}
          openChangeInformationModal={changeInformationModal.current?.openModal}
        />
      </ModalRewrite>

      <ModalRewrite
        title={`Informationen bearbeiten (ID: ${editUser?.id})`}
        ref={changeInformationModal}
      >
        <ChangeUserInformationModal
          editUser={editUser!}
          queryUsers={queryUsers}
          closeModal={changeInformationModal.current?.closeModal}
        />
      </ModalRewrite>

      <ModalRewrite title="Mitglied löschen" ref={deleteUserModal}>
        <DeleteUserModal
          editUser={editUser!}
          queryUsers={queryUsers}
          closeModal={deleteUserModal.current?.closeModal}
        />
      </ModalRewrite>

      <ModalRewrite title="Passwort zurücksetzen" ref={requestNewPasswordModal}>
        <RequestNewPasswordModal
          editUser={editUser!}
          closeModal={requestNewPasswordModal.current?.closeModal}
          openNewPasswordModal={newPasswordModal.current?.openModal}
        />
      </ModalRewrite>

      <ModalRewrite title="Neues Passwort angefragt" ref={newPasswordModal}>
        <NewPasswordModal
          editUser={editUser!}
          closeModal={newPasswordModal.current?.closeModal}
        />
      </ModalRewrite>
    </SettingsLayout>
  );
}
