import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Image from "@/components/elements/Image";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Input from "@/components/elements/Input";
import usePasswordTokenInfo from "@/hooks/api/usePasswortTokenInfo";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";
import useRedeemPasswordToken from "@/hooks/api/useRedeemPasswordToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import CustomText from "@/components/elements/CustomText";

export default function VerifyScreen() {
  const { t, intent } = useLocalSearchParams<{ t: string; intent: string }>();
  const { height } = useWindowDimensions();

  const { redeemToken, successfulRedeem, redeemError } =
    useRedeemPasswordToken();

  const tokenInput = useRef<TextInput>(null);

  const {
    verify,
    tokenValid,
    setTokenValid,
    productName,
    productId,
    firstname,
    lastname,
    email,
  } = usePasswordTokenInfo();

  const [title, setTitle] = useState("Passwort ändern");

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const thirdInput = useRef<TextInput>(null);

  useEffect(() => {
    if (tokenValid) {
      AsyncStorage.setItem("serverId", productId);
    }
  }, [tokenValid]);

  useEffect(() => {
    if (t && t.length == 36) {
      verify(t);
    } else {
      setTokenValid(false);
    }
  }, [t]);

  useEffect(() => {
    switch (intent) {
      case "onboarding": {
        setTitle("Account erstellen");
        break;
      }
      default:
        setTitle("Setzen Sie ihr Passwort");
    }
  }, [intent]);

  return (
    <SafeAreaView
      style={tw.style(`m-0 p-0 bg-[${Color.LIGHT_GRAY}] flex-row`, {
        height,
      })}
    >
      <View style={tw`justify-center items-center w-full`}>
        <View style={tw`w-full max-w-2xl border rounded-md border-gray-200`}>
          <View style={tw`items-center`}>
            <Image
              source={require("@/public/adaptive-icon.png")}
              style={{
                height: 220,
                width: 220,
              }}
            />
          </View>

          <CustomText style={tw`text-center p-0 m-0 text-lg`}>
            SEAS Kirchengemeinde
          </CustomText>

          <View style={tw`mx-5 mb-5`}>
            <CustomText style={tw`font-semibold text-3xl text-center mb-8`}>
              {title}
            </CustomText>

            <CustomText style={tw`text-xs ml-2`}>Token</CustomText>
            <Input
              placeholder="Token"
              onChangeText={() => {}}
              disabled={!(t === "" || t === undefined)}
              inputMode="text"
              ref={tokenInput}
              initialValue={t}
            />
            <Input
              placeholder="E-Mail"
              style={tw`hidden`}
              onChangeText={() => {}}
              disabled={true}
              inputMode="email"
              initialValue={email}
            />
            {tokenValid === false && (
              <>
                <CustomText style={tw`mt-4`}>Tut uns leid...</CustomText>
                <CustomText style={tw`text-red-500 text-2xl font-semibold`}>
                  Dieser Link ist nicht mehr gültig.
                </CustomText>
                <CustomText style={tw`mt-2`}>
                  Haben Sie bereits erneut ein Passwort angefordert?
                </CustomText>
              </>
            )}
            {tokenValid === true && productName && t && !successfulRedeem && (
              <>
                <CustomText style={tw`mt-6`}>
                  {intent == "onboarding" ? "Willkommen" : "Hallo"} {firstname}{" "}
                  {lastname}, bitte setzen Sie Ihr Passwort für Ihren Account
                  bei{" "}
                  <CustomText style={tw`font-semibold`}>
                    {productName}
                  </CustomText>
                  :
                </CustomText>
                <CustomText style={tw`mt-2`}>
                  Das neue Passwort muss mindestens 7 Zeichen haben. Erlaubt
                  sind Buchstaben, Zahlen und Sonderzeichen: -_!?/*%$
                </CustomText>

                <Input
                  placeholder="Passwort festlegen"
                  onChangeText={(text) => setNewPassword1(text)}
                  secureTextEntry={true}
                  autoComplete="new-password"
                  onSubmitEditing={() => thirdInput.current?.focus()}
                  returnKeyType="next"
                  style={tw`mt-2`}
                />
                <Input
                  placeholder="Passwort wiederholen"
                  onChangeText={(text) => setNewPassword2(text)}
                  secureTextEntry={true}
                  autoComplete="new-password"
                  onSubmitEditing={() =>
                    redeemToken(t, newPassword1, newPassword2)
                  }
                  ref={thirdInput}
                  returnKeyType="done"
                  style={tw`mt-2 mb-4`}
                />
                <ErrorDisplay
                  hasError={redeemError != ""}
                  error={redeemError}
                />

                <Button
                  onPress={() => redeemToken(t, newPassword1, newPassword2)}
                >
                  Passwort setzen
                </Button>
              </>
            )}
            {successfulRedeem && productName && (
              <>
                <CustomText style={tw`text-green-500 text-2xl font-semibold`}>
                  Sie haben Ihr Passwort erfolgreich{" "}
                  {intent == "onboarding" ? "gesetzt" : "geändert"}.
                </CustomText>
                <CustomText style={tw`mt-2`}>
                  Sie können sich nun mit Ihrer Email + Passwort bei{" "}
                  <CustomText style={tw`font-semibold`}>
                    {productName}
                  </CustomText>{" "}
                  anmelden.
                </CustomText>
                <Button onPress={() => router.replace("/login")}>
                  Zur Anmeldeseite
                </Button>
              </>
            )}
          </View>
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
