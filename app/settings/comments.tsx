import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import H1 from "@/components/elements/H1";
import Image from "@/components/elements/Image";
import Input from "@/components/elements/Input";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import SettingsActionButton from "@/components/settings/SettingsActionButton";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import { Color } from "@/helpers/Constants";
import useAllDefaultComments from "@/hooks/api/useAllDefaultComments";
import useCreateDefaultComment from "@/hooks/api/useCreateDefaultComment";
import useDeleteDefaultComment from "@/hooks/api/useDeleteDefaultComment";
import tw from "@/tailwind";

export default function ManageCommentsScreen() {
  const { allDefaultComments, queryAllDefaultComments } =
    useAllDefaultComments();

  const {
    createDefaultComment,
    hasCreationError,
    creationError,
    successfulDefaultCommentCreation,
  } = useCreateDefaultComment();

  const { deleteDefaultComment, succesfulDeletion } = useDeleteDefaultComment();

  const [defaultComment, setDefaultComment] = useState("");
  const [commentIdToDelete, setCommentIdToDelete] = useState(0);
  const [commentToDelete, setCommentToDelete] = useState("");

  const commentInput = useRef<TextInput>(null);
  const deleteModal = useRef<ModalHandle>(null);

  useEffect(() => {
    if (successfulDefaultCommentCreation) queryAllDefaultComments();
  }, [queryAllDefaultComments, successfulDefaultCommentCreation]);

  useEffect(() => {
    if (succesfulDeletion) {
      queryAllDefaultComments();
      deleteModal.current?.closeModal();
    }
  }, [queryAllDefaultComments, succesfulDeletion]);

  return (
    <SettingsLayout actualSetting="comments">
      <SettingsTitle>Kommentarvorlagen</SettingsTitle>

      <SettingsForm>
        <CustomText>
          Auf den Plänen gibt es Kommentarfelder. Um diese leichter auszufüllen
          mit sich ähnelnden Inhalten, können Vorlagen erstellt werden, die mit
          einem Klick eingefügt werden können.
        </CustomText>

        <Input
          className="mt-4"
          placeholder="Kommentar"
          onChangeText={(text) => setDefaultComment(text)}
          secureTextEntry={false}
          maxLength={64}
          ref={commentInput}
          onSubmitEditing={() => {
            createDefaultComment(defaultComment);
            commentInput.current?.clear();
            commentInput.current?.blur();
          }}
          returnKeyType="done"
        />

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Button
          onPress={() => {
            createDefaultComment(defaultComment);
            commentInput.current?.clear();
            commentInput.current?.blur();
          }}
        >
          Vorlage erstellen
        </Button>
      </SettingsForm>

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Kommentare", ""]}></TH>

          {allDefaultComments.map((comment) => (
            <TR key={comment.id}>
              <TD style={tw`justify-center`} cols={2}>
                <CustomText style={tw`text-lg`}>
                  {comment.comment.length > 32
                    ? comment.comment.substring(0, 32) + "..."
                    : comment.comment}
                </CustomText>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={2}>
                <SettingsActionButton
                  color={Color.RED}
                  onPress={() => {
                    setCommentIdToDelete(comment.id);
                    setCommentToDelete(comment.comment);
                    deleteModal.current?.openModal();
                  }}
                >
                  <Image source={require("@/assets/img/close.svg")} size={24} />
                </SettingsActionButton>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <Modal type="CENTER" ref={deleteModal}>
        <H1 style={tw`mt-2 text-center`}>Plan löschen?</H1>
        <CustomText style={tw`mx-4`}>
          Soll der Standartkommentar{" "}
          <CustomText style={tw`font-semibold`}>
            {commentToDelete.length > 32
              ? commentToDelete.substring(0, 32) + "..."
              : commentToDelete}
          </CustomText>{" "}
          wirklich glöscht werden?
        </CustomText>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteDefaultComment(commentIdToDelete);
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteModal.current?.closeModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
}
