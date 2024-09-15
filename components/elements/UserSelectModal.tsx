import { Text, View } from "react-native";
import React from "react";
import Button from "./Button";
import tw from "@/tailwind";

type Props = {
  closeModal?: () => void;
};

export default function UserSelectModal({ closeModal }: Props) {
  return (
    <View>
      <Text>UserSelectModal</Text>

      <View style={tw`flex-row justify-center my-2`}>
        <Button onPress={closeModal}>Fertig</Button>
      </View>
    </View>
  );
}
