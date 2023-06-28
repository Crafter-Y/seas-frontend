import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Modal from "react-native-modal";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import Input from "@/components/Input";
import { Button } from "@rneui/base";
import { Picker } from "@react-native-picker/picker";
import useCreateUser from "@/hooks/useCreateUser";

export type ManageUsersScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageUsersScreen"
>;

const ManageUsersScreen = () => {
  const navigation = useNavigation<ManageUsersScreenProps>();

  const { height, width } = useWindowDimensions();

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

  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  useEffect(() => {
    if (successfulUserCreation) {
      setIsCreationModalOpen(true);
      firstNameInput.current?.clear();
      secondNameInput.current?.clear();
      emailInput.current?.clear();
    }
  }, [successfulUserCreation]);

  return (
    <SettingsLayout navigation={navigation}>
      <Text
        style={tw.style("text-3xl font-semibold mb-6 opacity-85 mt-4", {
          "text-center": !isMd,
        })}
      >
        Nutzer erstellen
      </Text>

      <View
        style={tw.style(
          {
            "w-full": !isMd,
            "w-72": isMd,
            "px-6": !isSm && !isMd,
            "px-24": isSm && !isMd,
            "px-0": isMd,
          },
          "gap-2"
        )}
      >
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
        <View
          style={tw.style("border border-black border-opacity-20 rounded-xl")}
        >
          <Picker
            style={tw.style(
              {
                "py-2": Platform.OS == "ios",
                "py-1": Platform.OS != "ios",
                fontSize: 18,
                border: "none",
              },

              `rounded-xl px-2 bg-transparent`
            )}
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="User" value="USER" />
            <Picker.Item label="Moderator" value="MODERATOR" />
            <Picker.Item label="Admin" value="ADMIN" />
          </Picker>
        </View>

        <Text
          style={tw.style(
            {
              hidden: !hasCreationError,
            },
            "text-red-500 mb-2"
          )}
        >
          {creationError}
        </Text>

        <Button
          style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold`}
          color={"#3882d6"}
          onPress={() =>
            createUser(firstName, secondName, email, role, navigation)
          }
        >
          Nutzer erstellen
        </Button>
      </View>
      <Modal
        isVisible={isCreationModalOpen}
        onBackdropPress={() => setIsCreationModalOpen(false)}
        style={tw.style("m-0 flex items-center justify-center")}
        customBackdrop={
          <TouchableOpacity
            style={tw.style(
              {
                height,
                width,
              },
              "bg-opacity-35 bg-black"
            )}
            onPress={() => setIsCreationModalOpen(false)}
          ></TouchableOpacity>
        }
      >
        <View
          style={tw.style(
            {
              "w-1/2": Platform.OS == "web",
              width:
                Platform.OS == "web"
                  ? isSm
                    ? width / 2
                    : width * 0.75
                  : width,
            },
            `bg-white shadow-lg rounded-md`
          )}
        >
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
          <View style={tw`w-full items-center mb-4`}>
            <Button
              style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold`}
              color={"#3882d6"}
              onPress={() => setIsCreationModalOpen(false)}
            >
              Fertig
            </Button>
          </View>
        </View>
      </Modal>
    </SettingsLayout>
  );
};

export default ManageUsersScreen;
