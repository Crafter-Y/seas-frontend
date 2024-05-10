import { Pressable, Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import tw from "@/tailwind";
import Input from "@/components/elements/Input";
import { Picker as RNPicker } from "@react-native-picker/picker";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import SettingsForm from "@/components/SettingsForm";
import ErrorDisplay from "@/components/ErrorDisplay";
import Picker from "@/components/elements/Picker";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import TH from "@/components/elements/TH";
import useAllUsers from "@/hooks/api/useAllUsers";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import Form from "@/components/elements/Form";
import useAuthentication from "@/hooks/api/useAuthentication";
import Image from "@/components/elements/Image";
import H1 from "@/components/elements/H1";
import useDeleteUser from "@/hooks/api/useDeleteUser";
import useRequestNewPassword from "@/hooks/api/useRequestNewPassword";
import { Color } from "@/helpers/Constants";
import useUpdateUser from "@/hooks/api/useUpdateUser";
import { toUpperStarting } from "@/helpers/format";
import useRequestVerification from "@/hooks/api/useRequestVerification";
import SettingsTitle from "@/components/settings/SettingsTitle";
import CreateUserForm from "@/components/settings/CreateUserForm";

export default function ManageUsersScreen() {
  const { allUsers, queryUsers } = useAllUsers();

  const { requestNewPassword, successfulPasswordCreation } =
    useRequestNewPassword();

  const { deleteUser, succesfulDeletion } = useDeleteUser();

  const { updateUser, successfulUpdate, updateError } = useUpdateUser();

  const { requestVerification } = useRequestVerification();

  // edit modal states
  const [editFirstName, setEditFirstName] = useState("");
  const [editSecondName, setEditSecondName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Role>("USER");
  const [editState, setEditState] = useState<AccountState>("UNVERIFIED");
  const editFirstNameInput = useRef<TextInput>(null);
  const editSecondNameInput = useRef<TextInput>(null);
  const editEmailInput = useRef<TextInput>(null);
  const [hasTriedUpdate, setHasTriedUpdate] = useState(false);

  const editModal = useRef<ModalHandle>(null);
  const changeInformationModal = useRef<ModalHandle>(null);
  const deleteUserModal = useRef<ModalHandle>(null);
  const requestNewPasswordModal = useRef<ModalHandle>(null);
  const newPasswordModal = useRef<ModalHandle>(null);

  const [userIdToDelete, setUserIdToDelete] = useState(0);
  const [userNameToDelete, setUserNameToDelete] = useState("");

  const [userIdForEdit, setUserIdForEdit] = useState(0);
  const [userNameForEdit, setUserNameForEdit] = useState("");

  const { user } = useAuthentication();

  useEffect(() => {
    if (successfulPasswordCreation) newPasswordModal.current?.openModal();
  }, [successfulPasswordCreation]);

  useEffect(() => {
    if (successfulUpdate) {
      changeInformationModal.current?.closeModal();
      queryUsers();
    }
  }, [successfulUpdate]);

  useEffect(() => {
    if (succesfulDeletion) {
      queryUsers();
      deleteUserModal.current?.closeModal();
    }
  }, [succesfulDeletion]);

  return (
    <SettingsLayout actualSetting="users">
      <SettingsTitle>Nutzer erstellen</SettingsTitle>

      <CreateUserForm queryUsers={queryUsers} />

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Mitglieder", ""]}></TH>
          {allUsers.map((Luser) => (
            <TR key={Luser.id}>
              <TD cols={2}>
                <Text style={tw`text-lg`}>
                  {Luser.firstname} {Luser.lastname}
                </Text>
                <Text
                  style={tw.style({
                    hidden: Luser.email == "root",
                  })}
                >
                  {Luser.email}
                </Text>
                <View style={tw`flex-row gap-1`}>
                  <Text style={tw`border rounded-full px-1 py-0.5`}>
                    {toUpperStarting(Luser.role)}
                  </Text>
                  {}
                  <Text
                    style={tw.style(
                      {
                        hidden: Luser.email == "root",
                      },
                      "border rounded-full px-1 py-0.5"
                    )}
                  >
                    {toUpperStarting(Luser.state)}
                  </Text>
                </View>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={2}>
                {Luser.email != "root" && Luser.id != user?.id && (
                  <Button
                    color="#f67e7e"
                    style={tw`p-2.5`}
                    onPress={() => {
                      setUserIdToDelete(Luser.id);
                      setUserNameToDelete(
                        `${Luser.firstname} ${Luser.lastname}`
                      );
                      deleteUserModal.current?.openModal();
                    }}
                  >
                    <Image
                      source={require("@/assets/img/close.svg")}
                      size={24}
                    />
                  </Button>
                )}
                {Luser.email != "root" &&
                  (Luser.id != user?.id ||
                    Luser.state == "UNVERIFIED" ||
                    Luser.state == "VERIFICATION_PENDING") && (
                    <Button
                      style={tw`p-2.5`}
                      onPress={() => {
                        setUserIdForEdit(Luser.id);
                        setUserNameForEdit(
                          `${Luser.firstname} ${Luser.lastname}`
                        );
                        setEditFirstName(Luser.firstname);
                        setEditSecondName(Luser.lastname);
                        setEditEmail(Luser.email);
                        setEditRole(Luser.role);
                        setEditState(Luser.state);
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

      <Modal type="CENTER" ref={editModal}>
        <H1 style={tw`mt-2 text-center`}>
          Mitglied bearbeiten (ID: {userIdForEdit})
        </H1>

        <Divider type="HORIZONTAL" style={tw`mt-1`} />
        <Pressable
          style={tw.style(
            {
              hidden: userIdForEdit == user?.id,
            },
            "py-3 flex-row items-center mx-4 gap-2"
          )}
          onPress={() => {
            editModal.current?.closeModal();
            requestNewPasswordModal.current?.openModal();
          }}
        >
          <Text
            style={tw.style("text-lg font-semibold", {
              color: Color.BLUE,
            })}
          >
            Passwort zurücksetzen
          </Text>
          <Image
            source={require("@/assets/img/refresh.svg")}
            size={24}
            style={{ color: Color.BLUE }}
          />
        </Pressable>
        <Divider
          type="HORIZONTAL"
          style={tw.style(
            {
              hidden: userIdForEdit == user?.id,
            },
            "mb-1"
          )}
        />
        <Pressable
          style={tw.style(
            {
              hidden: userIdForEdit == user?.id,
            },
            "py-3 flex-row items-center mx-4 gap-2"
          )}
          onPress={() => {
            editModal.current?.closeModal();
            setHasTriedUpdate(false);
            changeInformationModal.current?.openModal();
          }}
        >
          <Text
            style={tw.style("text-lg font-semibold", {
              color: Color.BLUE,
            })}
          >
            Nutzer bearbeiten
          </Text>
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
              hidden: userIdForEdit == user?.id,
            },
            "mb-1"
          )}
        />
        <Pressable
          style={tw.style(
            {
              hidden:
                editState != "UNVERIFIED" &&
                editState != "VERIFICATION_PENDING",
            },
            "py-3 flex-row items-center mx-4 gap-2"
          )}
          onPress={() => {
            editModal.current?.closeModal();
            requestVerification(userIdForEdit);
            setTimeout(() => {
              queryUsers();
            }, 1000);
          }}
        >
          <Text
            style={tw.style("text-lg font-semibold", {
              color: Color.BLUE,
            })}
          >
            Verifizierung anfragen
          </Text>
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
                editState != "UNVERIFIED" &&
                editState != "VERIFICATION_PENDING",
            },
            "mb-1"
          )}
        />

        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => editModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={changeInformationModal}>
        <H1 style={tw`mt-2 text-center`}>
          Informationen bearbeiten? (ID: {userIdForEdit})
        </H1>
        <View style={tw`mx-4 gap-2`}>
          <Input
            placeholder="Vorname"
            initialValue={editFirstName}
            onChangeText={(text) => setEditFirstName(text)}
            secureTextEntry={false}
            ref={editFirstNameInput}
            onSubmitEditing={() => editSecondNameInput.current?.focus()}
            returnKeyType="next"
          />
          <Input
            placeholder="Nachname"
            onChangeText={(text) => setEditSecondName(text)}
            initialValue={editSecondName}
            secureTextEntry={false}
            onSubmitEditing={() => editEmailInput.current?.focus()}
            ref={editSecondNameInput}
            returnKeyType="next"
          />
          <Input
            placeholder="Email-Adresse"
            onChangeText={(text) => setEditEmail(text)}
            secureTextEntry={false}
            initialValue={editEmail}
            autoComplete="email"
            onSubmitEditing={() => editEmailInput.current?.blur()}
            ref={editEmailInput}
            returnKeyType="done"
            inputMode="email"
          />
          <Picker
            selectedValue={editRole}
            onValueChange={(itemValue) => setEditRole(itemValue as Role)}
          >
            <RNPicker.Item label="User" value="USER" />
            <RNPicker.Item label="Admin" value="ADMIN" />
          </Picker>
        </View>

        <ErrorDisplay
          hasError={!!updateError && hasTriedUpdate}
          error={updateError || ""}
          style={tw`mx-4`}
        />

        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => changeInformationModal.current?.closeModal()}>
            Abbrechen
          </Button>
          <Button
            onPress={() => {
              setHasTriedUpdate(true);
              updateUser(
                userIdForEdit,
                editFirstName,
                editSecondName,
                editEmail,
                editRole as Role
              );
            }}
            color={Color.GREEN}
          >
            Speichern
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={deleteUserModal}>
        <H1 style={tw`mt-2 text-center`}>Mitglied löschen?</H1>
        <Text style={tw`mx-4`}>
          Soll das Mitglied{" "}
          <Text style={tw`font-semibold`}>{userNameToDelete}</Text> wirklich
          glöscht werden?
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => deleteUserModal.current?.closeModal()}>
            Abbrechen
          </Button>
          <Button
            onPress={() => {
              deleteUser(userIdToDelete);
            }}
            color={Color.RED}
          >
            Löschen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={requestNewPasswordModal}>
        <H1 style={tw`mt-2 text-center`}>Passwort zurücksetzen?</H1>
        <Text style={tw`mx-4`}>
          Soll das Passwort von{" "}
          <Text style={tw`font-semibold`}>{userNameForEdit}</Text> wirklich
          zurückgesetzt werden?
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => requestNewPasswordModal.current?.closeModal()}>
            Abbrechen
          </Button>
          <Button
            onPress={() => {
              requestNewPassword(userIdForEdit);
              requestNewPasswordModal.current?.closeModal();
            }}
            color="#f67e7e"
          >
            Zurücksetzen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={newPasswordModal}>
        <H1 style={tw`mt-2 text-center`}>Neues Passwort angefragt</H1>
        <Text style={tw`mx-4`}>
          Das Passwort von{" "}
          <Text style={tw`font-semibold`}>{userNameForEdit}</Text> wurde
          erfolgreich zurück gesetzt.
        </Text>
        <Text style={tw`mx-4 text-lg`}>
          Das Mitglied hat eine E-Mail erhalten um ein neues Passwort zu wählen.
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => newPasswordModal.current?.closeModal()}>
            Fertig
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
}
