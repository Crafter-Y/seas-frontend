import { TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Input from "../elements/Input";
import tw from "@/tailwind";
import ErrorDisplay from "../ErrorDisplay";
import Button from "../elements/Button";
import useRenamePage from "@/hooks/api/useRenamePage";
import { Color } from "@/helpers/Constants";
import CustomText from "../elements/CustomText";

type Props = {
  selectedPage?: APIResponsePage;
  closeModal?: () => void;
  queryPages: () => void;
};

export default function RenamePageModal({
  selectedPage,
  closeModal,
  queryPages,
}: Props) {
  const { renamePage, hasRenameError, renameError, successfulPageRename } =
    useRenamePage();

  const renameInput = useRef<TextInput>(null);

  const [pageRenameName, setPageRenameName] = useState("");

  useEffect(() => {
    if (successfulPageRename) {
      queryPages();
      closeModal?.();
    }
  }, [successfulPageRename]);
  return (
    <>
      <CustomText style={tw`mt-4 mx-4`}>Neuen Plan Namen festlegen</CustomText>

      <Input
        initialValue={selectedPage?.name}
        className="mx-4"
        placeholder="Plan Name"
        onChangeText={(text) => setPageRenameName(text)}
        secureTextEntry={false}
        ref={renameInput}
        onSubmitEditing={() => {
          renamePage(selectedPage!.id, pageRenameName);
          renameInput.current?.blur();
        }}
        returnKeyType="done"
      />

      <ErrorDisplay
        style={tw`mx-4`}
        hasError={hasRenameError}
        error={renameError}
      />

      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button
          onPress={() => {
            renamePage(selectedPage!.id, pageRenameName);
            renameInput.current?.blur();
          }}
          color={Color.GREEN}
        >
          Umbenennen
        </Button>
        <Button onPress={closeModal}>Abbrechen</Button>
      </View>
    </>
  );
}
