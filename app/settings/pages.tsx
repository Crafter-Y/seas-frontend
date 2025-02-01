import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";

import Button from "@/components/elements/Button";
import Callout from "@/components/elements/Callout";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Form from "@/components/elements/Form";
import Input from "@/components/elements/Input";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import TD from "@/components/elements/TD";
import TH from "@/components/elements/TH";
import TR from "@/components/elements/TR";
import UserSelectModal from "@/components/elements/UserSelectModal";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import DeletePageModal from "@/components/settings/DeletePageModal";
import RenamePageModal from "@/components/settings/RenamePageModal";
import SettingsTitle from "@/components/settings/SettingsTitle";
import SettingsForm from "@/components/SettingsForm";
import useAllPages from "@/hooks/api/useAllPages";
import useAllUsers from "@/hooks/api/useAllUsers";
import useCreatePage from "@/hooks/api/useCreatePage";
import useRestrictions from "@/hooks/api/useRestrictions";
import useSetPageModerator from "@/hooks/api/useSetPageModerator";
import tw from "@/tailwind";

export default function ManagePagesScreen() {
  const { allPages, queryPages } = useAllPages();
  const { allUsers, queryUsers } = useAllUsers();

  const { restrictions, queryRestrictions } = useRestrictions();

  const { assignModerator, succesfulAssignment } = useSetPageModerator();

  const [pageName, setPageName] = useState("");
  const [maxPagesReached, setMaxPagesReached] = useState(false);

  const input = useRef<TextInput>(null);
  const deleteModal = useRef<ModalHandle>(null);
  const renameModal = useRef<ModalHandle>(null);
  const moderatorModal = useRef<ModalHandle>(null);

  const [selectedPage, setSelectedPage] = useState<APIResponsePage>();

  const {
    createPage,
    hasCreationError,
    creationError,
    successfulPageCreation,
  } = useCreatePage();

  useEffect(() => {
    if (successfulPageCreation) {
      queryPages();
      input.current?.clear();
    }
  }, [successfulPageCreation]);

  useEffect(() => {
    if (restrictions && allPages && restrictions.maxPages <= allPages.length) {
      setMaxPagesReached(true);
    } else {
      setMaxPagesReached(false);
    }
  }, [restrictions, allPages]);

  useEffect(() => {
    if (succesfulAssignment) {
      queryPages();
    }
  }, [succesfulAssignment]);

  return (
    <SettingsLayout
      actualSetting="pages"
      refreshAction={() => {
        queryRestrictions();
        queryUsers();
        queryPages();
      }}
    >
      <SettingsTitle>Pläne verwalten</SettingsTitle>

      <SettingsForm>
        <CustomText>
          Durch verschiedene Pläne können Gruppen erstellt werden, die getrennt
          voneinander angezeigt werden können.
        </CustomText>

        <Input
          className="mt-4"
          placeholder="Plan Name"
          onChangeText={(text) => setPageName(text)}
          disabled={maxPagesReached}
          secureTextEntry={false}
          ref={input}
          onSubmitEditing={() => {
            createPage(pageName);
            input.current?.clear();
            input.current?.blur();
          }}
          returnKeyType="done"
        />

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Callout
          visible={maxPagesReached}
          message="Die maximale Anzahl an Plänen wurde für Ihr Produkt erreicht."
        />

        <Button
          disabled={maxPagesReached}
          onPress={() => {
            createPage(pageName);
            input.current?.clear();
            input.current?.blur();
          }}
        >
          Plan erstellen
        </Button>
      </SettingsForm>

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <Callout
        visible={!restrictions?.pagesDeletable}
        message="Das Löschen von Plänen ist in Ihrem Produkt deaktiviert."
      />

      <Callout
        visible={!restrictions?.pagesChangable}
        message="Das Bearbeiten von Plänen ist in Ihrem Produkt deaktiviert."
      />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Pläne", ""]} />

          {allPages.map((page) => (
            <TR key={page.id}>
              <TD style={tw`justify-center`} cols={2}>
                <CustomText style={tw`text-lg`}>{page.name}</CustomText>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`} cols={2}>
                <Button
                  color="#f67e7e"
                  disabled={!restrictions?.pagesDeletable}
                  onPress={() => {
                    setSelectedPage(page);
                    deleteModal.current?.openModal();
                  }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </Button>

                <Button
                  disabled={!restrictions?.pagesChangable}
                  onPress={() => {
                    setSelectedPage(page);
                    renameModal.current?.openModal();
                  }}
                >
                  <AntDesign name="edit" size={24} color="black" />
                </Button>
                <Button
                  onPress={() => {
                    setSelectedPage(page);
                    moderatorModal.current?.openModal();
                  }}
                >
                  <AntDesign name="user" size={24} color="black" />
                </Button>
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <ModalRewrite title="modal.pages.deletePage" ref={deleteModal}>
        <DeletePageModal
          selectedPage={selectedPage}
          closeModal={() => deleteModal.current?.closeModal()}
          queryPages={queryPages}
        />
      </ModalRewrite>

      <ModalRewrite title="modal.pages.renamePage" ref={renameModal}>
        <RenamePageModal
          selectedPage={selectedPage}
          closeModal={() => renameModal.current?.closeModal()}
          queryPages={queryPages}
        />
      </ModalRewrite>

      <ModalRewrite
        title="modal.pages.chooseModerator"
        ref={moderatorModal}
        scrollable
      >
        <UserSelectModal
          initialSelectedUserId={selectedPage?.moderatorUserId ?? null}
          closeModal={() => moderatorModal.current?.closeModal()}
          onUserSet={(userId) => assignModerator(selectedPage!.id, userId)}
          allUsers={allUsers}
        />
      </ModalRewrite>
    </SettingsLayout>
  );
}
