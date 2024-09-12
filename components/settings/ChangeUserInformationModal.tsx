import tw from "@/tailwind";
import { TextInput, View } from "react-native";
import Input from "@/components/elements/Input";
import Picker from "@/components/elements/Picker";
import { Picker as RNPicker } from "@react-native-picker/picker";
import ErrorDisplay from "../ErrorDisplay";
import Button from "../elements/Button";
import { Color } from "@/helpers/Constants";
import { useEffect, useRef, useState } from "react";
import useUpdateUser from "@/hooks/api/useUpdateUser";

type Props = {
  editUser: APIFullResponseUser;
  queryUsers: () => void;
  closeModal?: () => void;
  maxUsersReached: boolean;
  maxAdminsReached: boolean;
};

const ChangeUserInformationModal = ({
  editUser,
  queryUsers,
  closeModal,
  maxUsersReached,
  maxAdminsReached,
}: Props) => {
  const { updateUser, successfulUpdate, updateError } = useUpdateUser();

  const [hasTriedUpdate, setHasTriedUpdate] = useState(false);

  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Role>("USER");

  const editFirstNameInput = useRef<TextInput>(null);
  const editSecondNameInput = useRef<TextInput>(null);
  const editEmailInput = useRef<TextInput>(null);

  useEffect(() => {
    setHasTriedUpdate(false);

    setEditFirstName(editUser.firstname);
    setEditLastName(editUser.lastname);
    setEditEmail(editUser.email);
    setEditRole(editUser.role);
  }, [editUser]);

  useEffect(() => {
    if (successfulUpdate) {
      closeModal?.();
      queryUsers();
    }
  }, [successfulUpdate]);

  return (
    <>
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
          onChangeText={(text) => setEditLastName(text)}
          initialValue={editLastName}
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
          {(editRole == "USER" || !maxUsersReached) && (
            <RNPicker.Item label="User" value="USER" />
          )}
          {(editRole == "ADMIN" || !maxAdminsReached) && (
            <RNPicker.Item label="Admin" value="ADMIN" />
          )}
        </Picker>
      </View>
      <ErrorDisplay
        hasError={!!updateError && hasTriedUpdate}
        error={updateError || ""}
        style={tw`mx-4`}
      />
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={closeModal}>Abbrechen</Button>
        <Button
          onPress={() => {
            setHasTriedUpdate(true);
            updateUser(
              editUser.id,
              editFirstName,
              editLastName,
              editEmail,
              editRole as Role
            );
          }}
          color={Color.GREEN}
        >
          Speichern
        </Button>
      </View>
    </>
  );
};

export default ChangeUserInformationModal;
