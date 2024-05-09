import { Platform, Text, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import tw from "@/tailwind";
import Input from "./elements/Input";
import Button from "./elements/Button";
import ErrorDisplay from "./ErrorDisplay";
import useMediaQueries from "@/hooks/useMediaQueries";

type Props = {
  back: () => void;
  login: (email: string, password: string) => void;
  hasAuthError: boolean;
  authError: string;
};

const LoginForm = ({ back, login, hasAuthError, authError }: Props) => {
  const { isSm, isMd } = useMediaQueries();
  const isWeb = Platform.OS == "web";

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const secondInput = useRef<TextInput>(null);

  return (
    <View
      style={tw.style(
        {
          "w-auto": isMd,
          "px-0": isMd,
          "px-20": isSm && !isMd,
          "w-full": !isMd,
          "px-2": !isMd && !isSm,
        },
        "mt-4 gap-2"
      )}
    >
      <Input
        placeholder="Email"
        autoFocus={true}
        onChangeText={(text) => setEmail(text)}
        onSubmitEditing={() => secondInput.current?.focus()}
        returnKeyType="next"
      />
      <Input
        placeholder="Passwort"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        ref={secondInput}
        returnKeyType="done"
        onSubmitEditing={() => login(email, password)}
      />

      <Button onPress={() => login(email, password)}>Anmelden</Button>

      <ErrorDisplay
        hasError={hasAuthError}
        error={
          authError == "Wrong credentials"
            ? "Email oder Passwort stimmt nicht"
            : authError
        }
      />

      <View
        style={tw.style({
          hidden: isWeb,
        })}
      >
        <Text style={tw`mt-2 mb-0`}>Falsch hier?</Text>
        <Button onPress={back}>Woanders anmelden</Button>
      </View>
    </View>
  );
};

export default LoginForm;
