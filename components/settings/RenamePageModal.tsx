import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Input from "@/components/elements/Input";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Color } from "@/helpers/Constants";
import useRenamePage from "@/hooks/api/useRenamePage";
import tw from "@/tailwind";

type Props = {
  selectedPage?: APIResponsePage;
  closeModal: () => void;
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
    // TODO: this gets fired twice (probably because of redefinition of querypages or closemodal because of parent rerender)
    if (successfulPageRename) {
      queryPages();
      closeModal();
    }
  }, [closeModal, queryPages, successfulPageRename]);

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
