import { Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigator/RootNavigator";
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

export type ManageUsersScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageUsersScreen"
>;

const ManageUsersScreen = () => {
  const navigation = useNavigation<ManageUsersScreenProps>();

  const { isMd, isSm } = useMediaQueries();

  const {
    createUser,
    hasCreationError,
    creationError,
    successfulUserCreation,
    userCreationResponse,
  } = useCreateUser();

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  const firstNameInput = useRef<TextInput>(null);
  const secondNameInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);

  const creationModal = useRef<ModalHandle>(null);

  useEffect(() => {
    if (successfulUserCreation) {
      creationModal.current?.toggleModal();
      firstNameInput.current?.clear();
      secondNameInput.current?.clear();
      emailInput.current?.clear();
    }
  }, [successfulUserCreation]);

  return (
    <SettingsLayout navigation={navigation}>
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
        ></Input>
        <Input
          placeholder="Nachname"
          onChangeText={(text) => setSecondName(text)}
          secureTextEntry={false}
          onSubmitEditing={() => emailInput.current?.focus()}
          ref={secondNameInput}
          returnKeyType="next"
        ></Input>
        <Input
          placeholder="Email-Adresse"
          onChangeText={(text) => setEmail(text)}
          secureTextEntry={false}
          onSubmitEditing={() => emailInput.current?.blur()}
          ref={emailInput}
          returnKeyType="done"
          inputMode="email"
        ></Input>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <RNPicker.Item label="User" value="USER" />
          <RNPicker.Item label="Moderator" value="MODERATOR" />
          <RNPicker.Item label="Admin" value="ADMIN" />
        </Picker>

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Button
          onPress={() =>
            createUser(firstName, secondName, email, role, navigation)
          }
        >
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
          <Button onPress={() => creationModal.current?.toggleModal()}>
            Fertig
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
};

export default ManageUsersScreen;
