import {
    View,
    Text,
    TextInput,
    useWindowDimensions,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import tw from "@/tailwind";
import "@expo/match-media";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useServerName from "@/hooks/api/useServerName";
import useAuthentication from "@/hooks/api/useAuthentication";
import useMediaQueries from "@/hooks/useMediaQueries";
import Input from "@/components/elements/Input";
import H1 from "@/components/elements/H1";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import { router, useSegments } from 'expo-router';

type WebConfig = {
    serverId: string;
};

export default function ServerSelectorScreen() {
    const { isSm, isMd } = useMediaQueries();

    const { height } = useWindowDimensions();

    const isWeb = Platform.OS == "web";

    const { serverName } = useServerName();

    const { login, authError, hasAuthError, user } = useAuthentication();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const secondInput = useRef<TextInput>(null);

    const segments = useSegments()

    useEffect(() => {
        if (Platform.OS == "web") {
            AsyncStorage.getItem("serverId").then(serverId => {
                if (serverId == null) {
                    fetch("/assets/config.json").then(res => res.json()).then((res: WebConfig) => {
                        if (res.serverId) {
                            AsyncStorage.setItem("serverId", res.serverId)
                            document.title = "Login ⋅ " + res.serverId
                        }
                    })
                }
            })
        }
    }, []);

    useEffect(() => {
        if (Platform.OS == "web" && serverName && segments[0] == "login") document.title = "Login ⋅ " + serverName
    }, [serverName, segments])

    useEffect(() => {
        if (user != null) {
            router.replace("/board/");
        }
    }, [user]);

    const back = () => {
        AsyncStorage.removeItem("serverId").then(() => {
            router.replace("/")
        });
    };

    const submit = () => {
        login(email, password, router);
    };

    return (
        <SafeAreaView style={{ margin: 0, padding: 0 }}>
            <View>
                <View
                    style={tw.style(`flex w-full flex-row`, {
                        height: height,
                    })}
                >
                    <View
                        style={tw.style(
                            {
                                hidden: !isMd,
                                flex: isMd,
                            },
                            ["flex-grow items-center gap-4"]
                        )}
                    >
                        <Text style={tw`text-4xl font-semibold mt-[10%]`}>Willkommen!</Text>
                        <Text style={tw`text-2xl`}>{serverName}</Text>
                    </View>
                    <View
                        style={tw.style(
                            {
                                "bg-white": isMd,
                                "w-96": isMd,
                                "justify-center": isMd,
                                "w-full": !isMd,
                                "shadow-lg": isSm || isMd,
                            },
                            "items-center border-l border-gray-200 px-4",
                            {
                                height: height,
                            }
                        )}
                    >
                        <Text
                            style={tw.style(
                                {
                                    hidden: isMd,
                                },
                                `text-4xl font-semibold mt-12`
                            )}
                        >
                            Willkommen!
                        </Text>
                        <Text
                            style={tw.style(
                                {
                                    hidden: isMd,
                                },
                                `text-2xl text-center`
                            )}
                        >
                            {serverName}
                        </Text>

                        <Divider
                            type="HORIZONTAL"
                            style={tw.style(`my-8 w-full`, {
                                hidden: isMd,
                            })}
                        />

                        <H1
                            style={tw.style({
                                "mb-12": isMd,
                            })}
                        >
                            Login
                        </H1>

                        <View
                            style={tw.style(
                                {
                                    "w-auto": isMd,
                                    "px-0": isMd,
                                    "px-20": isSm && !isMd,
                                    "w-full": !isMd,
                                    "px-2": !isMd && !isSm,
                                },
                                `mt-4 gap-2`
                            )}
                        >
                            <Input
                                placeholder="Email"
                                autoFocus={true}
                                onChangeText={(text) => setEmail(text)}
                                onSubmitEditing={() => secondInput.current?.focus()}
                                returnKeyType="next"
                            ></Input>
                            <Input
                                placeholder="Passwort"
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                                ref={secondInput}
                                returnKeyType="done"
                                onSubmitEditing={submit}
                            ></Input>

                            <Button onPress={submit}>Anmelden</Button>

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
                        <Text style={tw`text-xs opacity-80 w-full text-center mt-12`}>
                            &copy; Helmut Haase 2023
                        </Text>
                        <Text style={tw`text-xs opacity-80 w-full text-center`}></Text>
                        <Text
                            style={tw.style(
                                { hidden: !isWeb },
                                `underline text-xs opacity-80 w-full text-center`
                            )}
                            onPress={() => {
                                router.push("/imprint")
                            }}
                        >
                            Impressum
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}