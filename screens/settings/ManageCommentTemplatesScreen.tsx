import { Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import H2 from "@/components/elements/H2";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import SettingsForm from "@/components/SettingsForm";
import Input from "@/components/elements/Input";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import H1 from "@/components/elements/H1";
import useAllDefaultComments from "@/hooks/api/useAllDefaultComments";
import useCreateDefaultComment from "@/hooks/api/useCreateDefaultComment";
import useDeleteDefaultComment from "@/hooks/api/useDeleteDefaultComment";

export type ManageCommentTemplatesScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageCommentTemplatesScreen"
>;

const ManageCommentTemplatesScreen = () => {
  const navigation = useNavigation<ManageCommentTemplatesScreenProps>();

  const { isMd } = useMediaQueries();

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
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [commentToDelete, setCommentToDelete] = useState("");

  const commentInput = useRef<TextInput>(null);
  const deleteModal = useRef<ModalHandle>(null);

  useEffect(() => {
    if (successfulDefaultCommentCreation) queryAllDefaultComments();
  }, [successfulDefaultCommentCreation]);

  useEffect(() => {
    if (succesfulDeletion) {
      queryAllDefaultComments();
      deleteModal.current?.toggleModal();
    }
  }, [succesfulDeletion]);

  return (
    <SettingsLayout navigation={navigation}>
      <H2
        style={tw.style(
          {
            "text-center": !isMd,
          },
          "mt-4"
        )}
      >
        Kommentare verwalten
      </H2>

      <SettingsForm>
        <Text>
          Auf den Plänen gibt es Kommentarfelder. Um diese leichter auszufüllen
          mit sich ähnelnden Inhalten, können Vorlagen erstellt werden, die mit
          einem Klick eingefügt werden können.
        </Text>

        <Input
          style={tw`mt-4`}
          placeholder="Kommentar"
          onChangeText={(text) => setDefaultComment(text)}
          secureTextEntry={false}
          ref={commentInput}
          onSubmitEditing={() => {
            createDefaultComment(defaultComment, navigation);
            commentInput.current?.clear();
            commentInput.current?.blur();
          }}
          returnKeyType="done"
        />

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Button
          onPress={() => {
            createDefaultComment(defaultComment, navigation);
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
            <TR key={comment.commentId}>
              <TD style={tw`justify-center`}>
                <Text style={tw`text-lg`}>
                  {comment.comment.length > 32
                    ? comment.comment.substring(0, 32) + "..."
                    : comment.comment}
                </Text>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`}>
                <Button
                  color="#f67e7e"
                  style={tw`p-1`}
                  onPress={() => {
                    setCommentIdToDelete(comment.commentId);
                    setCommentToDelete(comment.comment);
                    deleteModal.current?.toggleModal();
                  }}
                >
                  <Image
                    source={require("@/assets/img/close.svg")}
                    style={{ height: 24, width: 24 }}
                  />
                </Button>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <Modal type="CENTER" ref={deleteModal}>
        <H1 style={tw`mt-2 text-center`}>Plan löschen?</H1>
        <Text style={tw`mx-4`}>
          Soll der Standartkommentar{" "}
          <Text style={tw`font-semibold`}>
            {commentToDelete.length > 32
              ? commentToDelete.substring(0, 32) + "..."
              : commentToDelete}
          </Text>{" "}
          wirklich glöscht werden?
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteDefaultComment(commentIdToDelete);
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteModal.current?.toggleModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
};

export default ManageCommentTemplatesScreen;
