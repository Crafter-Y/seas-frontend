import useCreateUser from "@/hooks/api/useCreateUser";
import SettingsForm from "@/components/SettingsForm";
import Input from "@/components/elements/Input";
import { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import Picker from "@/components/elements/Picker";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";
import UserCreatedModal from "@/components/settings/UserCreatedModal";
import { ModalHandle } from "@/components/elements/Modal";
import UserReactivatedModal from "./UserReactivatedModal";
import ReactivateUserModal from "./ReactivateUserModal";

type Props = {
  queryUsers: () => Promise<void>;
};

const CreateUserForm = ({ queryUsers }: Props) => {
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
          <RNPicker.Item label="Admin" value="ADMIN" />
        </Picker>

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Button onPress={() => createUser(firstName, secondName, email, role)}>
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
