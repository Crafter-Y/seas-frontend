import React, { useEffect } from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import useDeleteDefaultComment from "@/hooks/api/useDeleteDefaultComment";

type Props = {
  closeModal: () => void;
  queryAllDefaultComments: () => void;
  selectedComment?: APIResponseDefaultComment;
};

const DeleteDefaultCommentModal = ({
  closeModal,
  queryAllDefaultComments,
  selectedComment,
}: Props) => {
  const { deleteDefaultComment, succesfulDeletion } = useDeleteDefaultComment();

  useEffect(() => {
    if (succesfulDeletion) {
      queryAllDefaultComments();
      closeModal();
    }
  }, [queryAllDefaultComments, succesfulDeletion, closeModal]);

  return (
    <>
      <CustomText className="mx-4">
        Soll der Standartkommentar{" "}
        <CustomText className="font-semibold">
          {selectedComment!.comment!.length > 32
            ? selectedComment!.comment!.substring(0, 32) + "..."
            : selectedComment!.comment}
        </CustomText>{" "}
        wirklich glöscht werden?
      </CustomText>
      <View className="justify-center flex-row gap-2 my-4">
        <Button
          onPress={() => {
            deleteDefaultComment(selectedComment!.id);
          }}
          color={Color.RED}
        >
          Löschen
        </Button>
        <Button onPress={() => closeModal()}>Abbrechen</Button>
      </View>
    </>
  );
};

export default DeleteDefaultCommentModal;
