import { Pressable, Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import Input from "@/components/elements/Input";
import { Picker as RNPicker } from "@react-native-picker/picker";
import useCreateUser from "@/hooks/api/useCreateUser";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import H2 from "@/components/elements/H2";
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
import useReactivateUser from "@/hooks/api/useReactivateUser";
import { Color } from "@/helpers/Constants";
import useUpdateUser from "@/hooks/api/useUpdateUser";

export default function ManageUsersScreen() {
  const { isMd } = useMediaQueries();

  const { allUsers, queryUsers } = useAllUsers();

  const {
    createUser,
    hasCreationError,
    creationError,
    successfulUserCreation,
    userCreationResponse,
    reactivationRequired,
  } = useCreateUser();

  const {
    reactivateUser,
    hasReactivationError,
    reactivationError,
    successfulUserReactivation,
    userReactivationResponse,
  } = useReactivateUser();

  const { requestNewPassword, newPassword, successfulPasswordCreation } =
    useRequestNewPassword();

  const { deleteUser, succesfulDeletion } = useDeleteUser();

  const { updateUser, successfulUpdate, updateError } = useUpdateUser();

  // creation modal states
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const firstNameInput = useRef<TextInput>(null);
  const secondNameInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);

  // edit modal states
  const [editFirstName, setEditFirstName] = useState("");
  const [editSecondName, setEditSecondName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("USER");
  const editFirstNameInput = useRef<TextInput>(null);
  const editSecondNameInput = useRef<TextInput>(null);
  const editEmailInput = useRef<TextInput>(null);
  const [hasTriedUpdate, setHasTriedUpdate] = useState(false);

  const creationModal = useRef<ModalHandle>(null);
  const editModal = useRef<ModalHandle>(null);
  const changeInformationModal = useRef<ModalHandle>(null);
  const deleteUserModal = useRef<ModalHandle>(null);
  const requestNewPasswordModal = useRef<ModalHandle>(null);
  const newPasswordModal = useRef<ModalHandle>(null);
  const reactivationModal = useRef<ModalHandle>(null);
  const afterReactivationModal = useRef<ModalHandle>(null);

  const [userIdToDelete, setUserIdToDelete] = useState(0);
  const [userNameToDelete, setUserNameToDelete] = useState("");

  const [userIdForEdit, setUserIdForEdit] = useState(0);
  const [userNameForEdit, setUserNameForEdit] = useState("");

  const { user } = useAuthentication();

  useEffect(() => {
    if (successfulPasswordCreation) newPasswordModal.current?.openModal();
  }, [newPassword]);

  useEffect(() => {
    if (successfulUpdate) {
      changeInformationModal.current?.closeModal();
      queryUsers();
    }
  }, [successfulUpdate]);

  useEffect(() => {
    if (reactivationRequired) reactivationModal.current?.openModal();
  }, [reactivationRequired]);

  useEffect(() => {
    if (successfulUserCreation) {
      creationModal.current?.openModal();
      firstNameInput.current?.clear();
      secondNameInput.current?.clear();
      emailInput.current?.clear();
    }
  }, [successfulUserCreation]);

  useEffect(() => {
    if (successfulUserReactivation) {
      afterReactivationModal.current?.openModal();
      firstNameInput.current?.clear();
      secondNameInput.current?.clear();
      emailInput.current?.clear();
    }
  }, [successfulUserReactivation]);

  useEffect(() => {
    if (succesfulDeletion) {
      queryUsers();
      deleteUserModal.current?.closeModal();
    }
  }, [succesfulDeletion]);

  return (
    <SettingsLayout actualSetting="users">
      <H2
        style={tw.style(
          {
            "text-center": !isMd,
          },
          "mt-4"
        )}
      >
        Nutzer erstellen
      </H2>

      <SettingsForm>
        <Input
          placeholder="Vorname"
          onChangeText={(text) => setFirstName(text)}
          secureTextEntry={false}
          ref={firstNameInput}
          onSubmitEditing={() => secondNameInput.current?.focus()}
          returnKeyType="next"
        />
        <Input
          placeholder="Nachname"
          onChangeText={(text) => setSecondName(text)}
          secureTextEntry={false}
          onSubmitEditing={() => emailInput.current?.focus()}
          ref={secondNameInput}
          returnKeyType="next"
        />
        <Input
          placeholder="Email-Adresse"
          onChangeText={(text) => setEmail(text)}
          secureTextEntry={false}
          onSubmitEditing={() => emailInput.current?.blur()}
          ref={emailInput}
          returnKeyType="done"
          inputMode="email"
        />
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <RNPicker.Item label="User" value="USER" />
          <RNPicker.Item label="Moderator" value="MODERATOR" />
          <RNPicker.Item label="Admin" value="ADMIN" />
        </Picker>

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <ErrorDisplay
          hasError={hasReactivationError}
          error={reactivationError}
        />

        <Button onPress={() => createUser(firstName, secondName, email, role)}>
          Nutzer erstellen
        </Button>
      </SettingsForm>

      <Modal type="CENTER" ref={creationModal}>
        <Text
          style={tw`text-center text-2xl mt-6 px-4 font-semibold underline`}
        >
          Es wurde erfolgreich ein neuer Nutzer erstellt.
        </Text>
        <View style={tw`px-4 mt-4 gap-2`}>
          <Text>
            Rolle:{" "}
            {userCreationResponse?.role.charAt(0).toUpperCase() +
              "" +
              userCreationResponse?.role.slice(1).toLowerCase()}
          </Text>
          <Text style={tw`text-lg`}>
            {userCreationResponse?.firstname +
              " " +
              userCreationResponse?.lastname +
              " (" +
              userCreationResponse?.email +
              ")"}
          </Text>
          <Text style={tw`text-lg font-bold`}>
            {userCreationResponse?.password}
          </Text>
        </View>
        <View style={tw`items-center mb-4`}>
          <Button
            onPress={() => {
              queryUsers();
              creationModal.current?.closeModal();
            }}
          >
            Fertig
          </Button>
        </View>
      </Modal>

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
                <View style={tw`flex-row`}>
                  <Text style={tw`border rounded-full px-1 py-0.5`}>
                    {Luser.role.charAt(0).toUpperCase() +
                      "" +
                      Luser.role.slice(1).toLowerCase()}
                  </Text>
                </View>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={2}>
                {Luser.email != "root" && Luser.id != user?.id && (
                  <Button
                    color="#f67e7e"
                    style={tw`p-1`}
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
                {Luser.id != user?.id && (
                  <Button
                    style={tw`p-1`}
                    onPress={() => {
                      setUserIdForEdit(Luser.id);
                      setUserNameForEdit(
                        `${Luser.firstname} ${Luser.lastname}`
                      );
                      setEditFirstName(Luser.firstname);
                      setEditSecondName(Luser.lastname);
                      setEditEmail(Luser.email);
                      setEditRole(Luser.role);
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
          style={tw`py-3 flex-row items-center mx-4 gap-2`}
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
        <Divider type="HORIZONTAL" style={tw`mb-1`} />
        <Pressable
          style={tw`py-3 flex-row items-center mx-4 gap-2`}
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
        <Divider type="HORIZONTAL" style={tw`mb-1`} />

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
            onSubmitEditing={() => editEmailInput.current?.blur()}
            ref={editEmailInput}
            returnKeyType="done"
            inputMode="email"
          />
          <Picker
            selectedValue={editRole}
            onValueChange={(itemValue) => setEditRole(itemValue)}
          >
            <RNPicker.Item label="User" value="USER" />
            <RNPicker.Item label="Moderator" value="MODERATOR" />
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
        <H1 style={tw`mt-2 text-center`}>Neues Passwort generiert</H1>
        <Text style={tw`mx-4`}>
          Das Passwort von{" "}
          <Text style={tw`font-semibold`}>{userNameForEdit}</Text> wurde
          erfolgreich zurück gesetzt.
        </Text>
        <Text style={tw`mx-4 text-lg`} selectable>
          Das neue Passwort lautet: {newPassword}
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => newPasswordModal.current?.closeModal()}>
            Fertig
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={reactivationModal}>
        <Text
          style={tw`text-center text-2xl mt-6 px-4 font-semibold underline`}
        >
          Benutzer neu aktivieren?
        </Text>
        <View style={tw`px-4 mt-4 gap-2`}>
          <Text>
            Ein ehemaliger Mitglied mit dieser Email Adresse existierte bereits.
            Wenn dieser erneut aktiviert wird, bleiben alle ehemaligen
            Eintragungen unter neuem Namen bestehen.
          </Text>
          <Text>Soll dieser Nutzer neu aktiviert werden?</Text>
        </View>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              reactivateUser(firstName, secondName, email, role);
              reactivationModal.current?.closeModal();
            }}
            color="#f67e7e"
          >
            Ja
          </Button>
          <Button
            onPress={() => {
              reactivationModal.current?.closeModal();
              firstNameInput.current?.clear();
              secondNameInput.current?.clear();
              emailInput.current?.clear();
            }}
          >
            Nein
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={afterReactivationModal}>
        <Text
          style={tw`text-center text-2xl mt-6 px-4 font-semibold underline`}
        >
          Mitglied erfolgreich reaktiviert
        </Text>
        <View style={tw`px-4 mt-4 gap-2`}>
          <Text>
            Rolle:{" "}
            {userReactivationResponse?.role.charAt(0).toUpperCase() +
              "" +
              userReactivationResponse?.role.slice(1).toLowerCase()}
          </Text>
          <Text style={tw`text-lg`}>
            {userReactivationResponse?.firstname +
              " " +
              userReactivationResponse?.lastname +
              " (" +
              userReactivationResponse?.email +
              ")"}
          </Text>
          <Text style={tw`text-lg font-bold`}>
            {userReactivationResponse?.password}
          </Text>
        </View>
        <View style={tw`items-center mb-4`}>
          <Button
            onPress={() => {
              queryUsers();
              afterReactivationModal.current?.closeModal();
            }}
          >
            Fertig
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
}
