import { Picker as RNPicker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { TextInput } from "react-native";

import Button from "@/components/elements/Button";
import Callout from "@/components/elements/Callout";
import Input from "@/components/elements/Input";
import { ModalHandle } from "@/components/elements/Modal";
import Picker from "@/components/elements/Picker";
import ErrorDisplay from "@/components/ErrorDisplay";
import ReactivateUserModal from "@/components/settings/ReactivateUserModal";
import UserCreatedModal from "@/components/settings/UserCreatedModal";
import UserReactivatedModal from "@/components/settings/UserReactivatedModal";
import SettingsForm from "@/components/SettingsForm";
import useCreateUser from "@/hooks/api/useCreateUser";

type Props = {
  queryUsers: () => Promise<void>;
  maxUsersReached: boolean;
  maxAdminsReached: boolean;
};

const CreateUserForm = ({
  queryUsers,
  maxUsersReached,
  maxAdminsReached,
}: Props) => {
  const {
    createUser,
    reactivateUser,
    hasCreationError,
    creationError,
    successfulUserCreation,
    reactivationRequired,
    successfulUserReactivation,
  } = useCreateUser();

  const creationModal = useRef<ModalHandle>(null);
  const reactivationModal = useRef<ModalHandle>(null);
  const afterReactivationModal = useRef<ModalHandle>(null);

  const firstNameInput = useRef<TextInput>(null);
  const secondNameInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  useEffect(() => {
    if (successfulUserCreation) {
      creationModal.current?.openModal();
      firstNameInput.current?.clear();
      secondNameInput.current?.clear();
      emailInput.current?.clear();
      queryUsers();
    }
  }, [successfulUserCreation]);

  useEffect(() => {
    if (successfulUserReactivation) {
      afterReactivationModal.current?.openModal();
      firstNameInput.current?.clear();
      secondNameInput.current?.clear();
      emailInput.current?.clear();
      queryUsers();
    }
  }, [successfulUserReactivation]);

  useEffect(() => {
    if (reactivationRequired) reactivationModal.current?.openModal();
  }, [reactivationRequired]);

  return (
    <>
      <SettingsForm>
        <Callout
          visible={maxAdminsReached && !maxUsersReached}
          message="Die maximale Anzahl an Admins wurde für Ihr Produkt erreicht."
        />
        <Callout
          visible={!maxAdminsReached && maxUsersReached}
          message="Die maximale Anzahl an Usern wurde für Ihr Produkt erreicht."
        />

        <Input
          placeholder="Vorname"
          onChangeText={setFirstName}
          disabled={maxUsersReached && maxAdminsReached}
          secureTextEntry={false}
          ref={firstNameInput}
          onSubmitEditing={() => secondNameInput.current?.focus()}
          returnKeyType="next"
        />
        <Input
          placeholder="Nachname"
          onChangeText={setSecondName}
          disabled={maxUsersReached && maxAdminsReached}
          secureTextEntry={false}
          onSubmitEditing={() => emailInput.current?.focus()}
          ref={secondNameInput}
          returnKeyType="next"
        />
        <Input
          placeholder="Email-Adresse"
          onChangeText={setEmail}
          disabled={maxUsersReached && maxAdminsReached}
          secureTextEntry={false}
          autoComplete="email"
          onSubmitEditing={() => emailInput.current?.blur()}
          ref={emailInput}
          returnKeyType="done"
          inputMode="email"
        />
        <Picker
          selectedValue={role}
          disabled={maxUsersReached && maxAdminsReached}
          onValueChange={setRole}
        >
          {!maxUsersReached && <RNPicker.Item label="User" value="USER" />}
          {!maxAdminsReached && <RNPicker.Item label="Admin" value="ADMIN" />}
        </Picker>

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Callout
          visible={maxAdminsReached && maxUsersReached}
          message="Die maximale Anzahl an Mitgliedern wurde für Ihr Produkt erreicht."
        />

        <Button
          disabled={maxUsersReached && maxAdminsReached}
          onPress={() => createUser(firstName, secondName, email, role)}
        >
          Nutzer erstellen
        </Button>
      </SettingsForm>

      <UserCreatedModal ref={creationModal} />

      <ReactivateUserModal
        reactivateUser={() =>
          reactivateUser(firstName, secondName, email, role)
        }
        clearInputs={() => {
          firstNameInput.current?.clear();
          secondNameInput.current?.clear();
          emailInput.current?.clear();
        }}
        ref={reactivationModal}
      />

      <UserReactivatedModal ref={afterReactivationModal} />
    </>
  );
};

export default CreateUserForm;
