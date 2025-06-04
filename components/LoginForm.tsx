import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Input from "@/components/elements/Input";
import ErrorDisplay from "@/components/ErrorDisplay";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";

type Props = {
  back: () => void;
  login: (email: string, password: string) => void;
  hasAuthError: boolean;
  authError: string;
};

const LoginForm = ({ back, login, hasAuthError, authError }: Props) => {
  const { isSm, isMd } = useMediaQueries();
  const isWeb = Platform.OS === "web";

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
        "mt-4 gap-2",
      )}
    >
      <Input
        placeholder="Email"
        inputMode="email"
        autoFocus={true}
        autoComplete="email"
        onChangeText={(text) => setEmail(text)}
        onSubmitEditing={() => secondInput.current?.focus()}
        returnKeyType="next"
        testID="login-email-input"
      />
      <Input
        placeholder="Passwort"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        ref={secondInput}
        autoComplete="password"
        returnKeyType="done"
        onSubmitEditing={() => login(email, password)}
        testID="login-password-input"
      />

      <Button onPress={() => login(email, password)} testID="login-button">
        Anmelden
      </Button>

      <ErrorDisplay
        hasError={hasAuthError}
        error={
          authError === "Wrong credentials"
            ? "Email oder Passwort stimmt nicht"
            : authError
        }
      />

      <CustomText
        style={tw.style("underline opacity-80")}
        onPress={() => {
          router.navigate({
            pathname: "/passwordreset",
            params: {
              email: email,
            },
          });
        }}
      >
        Passwort vergessen
      </CustomText>

      <View
        style={tw.style({
          hidden: isWeb,
        })}
      >
        <CustomText style={tw`mt-2 mb-0`}>Falsch hier?</CustomText>
        <Button onPress={back}>Woanders anmelden</Button>
      </View>
    </View>
  );
};

export default LoginForm;
