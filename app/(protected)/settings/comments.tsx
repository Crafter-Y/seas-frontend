import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import Image from "@/components/elements/Image";
import Input from "@/components/elements/Input";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import DeleteDefaultCommentModal from "@/components/settings/DeleteDefaultCommentModal";
import SettingsActionButton from "@/components/settings/SettingsActionButton";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import { Color } from "@/helpers/Constants";
import useAllDefaultComments from "@/hooks/api/useAllDefaultComments";
import useCreateDefaultComment from "@/hooks/api/useCreateDefaultComment";

export default function ManageCommentsScreen() {
  const { allDefaultComments, queryAllDefaultComments } =
    useAllDefaultComments();

  const {
    createDefaultComment,
    hasCreationError,
    creationError,
    successfulDefaultCommentCreation,
  } = useCreateDefaultComment();

  const { t } = useTranslation();

  const [defaultComment, setDefaultComment] = useState("");
  const [selectedComment, setSelectedComment] =
    useState<APIResponseDefaultComment>();

  const commentInput = useRef<TextInput>(null);
  const deleteModal = useRef<ModalHandle>(null);

  useEffect(() => {
    if (successfulDefaultCommentCreation) queryAllDefaultComments();
  }, [queryAllDefaultComments, successfulDefaultCommentCreation]);

  return (
    <SettingsLayout actualSetting="comments">
      <SettingsTitle t="commentTemplates" />

      <SettingsForm>
        <CustomText t="commentTemplatesDescription" />

        <Input
          className="mt-4"
          placeholder={t("comment")}
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
          {t("createTemplate")}
        </Button>
      </SettingsForm>

      <Divider type="HORIZONTAL" className="my-4" />

      <SettingsForm className="mb-8">
        <Form>
          <TH titles={[t("comments"), ""]}></TH>

          {allDefaultComments.map((comment) => (
            <TR key={comment.id}>
              <TD className="justify-center" cols={2}>
                <CustomText className="text-lg">
                  {comment.comment.length > 32
                    ? comment.comment.substring(0, 32) + "..."
                    : comment.comment}
                </CustomText>
              </TD>
              <TD className="justify-end flex-row items-center gap-1" cols={2}>
                <SettingsActionButton
                  color={Color.RED}
                  onPress={() => {
                    setSelectedComment(comment);
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

      <ModalRewrite ref={deleteModal} title="modal.comments.deleteComment">
        <DeleteDefaultCommentModal
          closeModal={() => deleteModal.current?.closeModal()}
          queryAllDefaultComments={queryAllDefaultComments}
          selectedComment={selectedComment}
        />
      </ModalRewrite>
    </SettingsLayout>
  );
}
