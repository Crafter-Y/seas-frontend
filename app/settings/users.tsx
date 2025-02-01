import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import Image from "@/components/elements/Image";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import ChangeUserInformationModal from "@/components/settings/ChangeUserInformationModal";
import CreateUserForm from "@/components/settings/CreateUserForm";
import DeleteUserModal from "@/components/settings/DeleteUserModal";
import EditUserModal from "@/components/settings/EditUserModal";
import NewPasswordModal from "@/components/settings/NewPasswordModal";
import RequestNewPasswordModal from "@/components/settings/RequestNewPasswordModal";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import { Color } from "@/helpers/Constants";
import { toUpperStarting } from "@/helpers/format";
import useAllUsers from "@/hooks/api/useAllUsers";
import useAuthentication from "@/hooks/api/useAuthentication";
import useRestrictions from "@/hooks/api/useRestrictions";
import tw from "@/tailwind";

export default function ManageUsersScreen() {
  const { user } = useAuthentication();
  const { t } = useTranslation();

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
        allUsers.filter((user) => user.role === "USER").length
    ) {
      setMaxUsersReached(true);
    }
    if (
      restrictions &&
      allUsers &&
      restrictions.maxAdmins <=
        allUsers.filter((user) => user.role === "ADMIN").length
    ) {
      setMaxAdminsReached(true);
    }
  }, [restrictions, allUsers]);

  return (
    <SettingsLayout actualSetting="users">
      <SettingsTitle t="createUser" className="" />

      <CreateUserForm
        queryUsers={queryUsers}
        maxUsersReached={maxUsersReached}
        maxAdminsReached={maxAdminsReached}
      />

      <Divider type="HORIZONTAL" className="my-4" />

      <SettingsForm className="mb-12">
        <Form>
          <TH titles={[t("members"), ""]}></TH>
          {allUsers.map((entry) => (
            <TR key={entry.id}>
              <TD cols={2}>
                <CustomText className="text-lg">
                  {entry.firstname} {entry.lastname}
                </CustomText>
                <CustomText
                  style={tw.style({
                    hidden: entry.email === "root",
                  })}
                >
                  {entry.email}
                </CustomText>
                <View className="flex-row gap-1">
                  <CustomText className="border rounded-full px-1 py-0.5">
                    {toUpperStarting(entry.role)}
                  </CustomText>
                  <CustomText
                    // TODO: remove root user from existance - only for legacy imported products & should no longer exist
                    className={`border rounded-full px-1 py-0.5 ${
                      entry.email === "root" ? "hidden" : ""
                    }`}
                  >
                    {toUpperStarting(entry.state)}
                  </CustomText>
                </View>
              </TD>
              <TD className="justify-end flex-row items-center gap-1" cols={2}>
                {entry.email !== "root" && entry.id !== user?.id && (
                  <Button
                    color={Color.RED}
                    className="p-2.5"
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
                {entry.email !== "root" &&
                  (entry.id !== user?.id ||
                    entry.state === "UNVERIFIED" ||
                    entry.state === "VERIFICATION_PENDING") && (
                    <Button
                      className="p-2.5"
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
