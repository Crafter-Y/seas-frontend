import tw from "@/tailwind";
import { View } from "react-native";
import BoardAssignButton from "./BoardAssignButton";
import useAllExistingUsers from "@/hooks/api/useAllExistingUsers";
import useAssignUser from "@/hooks/api/useAssignUser";
import { useEffect } from "react";
import useSingleBoardEntry from "@/hooks/api/useSingleBoardEntry";
import React from "react";
import CustomText from "../elements/CustomText";

type Props = {
  closeModal?: () => void;
  selectedColumn?: APIResponseColumn;
};

export default function BoardRowAssignOtherModal({
  closeModal,
  selectedColumn,
}: Props) {
  const { allExistingUsers } = useAllExistingUsers();
  const { assignUser, assignmentSuccessful } = useAssignUser();
  const { selectedRow, querySingleRow } = useSingleBoardEntry();

  useEffect(() => {
    if (assignmentSuccessful) querySingleRow(selectedRow!.date);
  }, [assignmentSuccessful]);

  return (
    <>
      <CustomText style={tw`mx-4`}>
        Folgende Mitglieder sind in diesem Produkt verfügbar:
      </CustomText>
      <View style={tw`flex-row flex-wrap px-2`}>
        {allExistingUsers
          .filter((user_) => user_.firstname != "root")
          .filter((user_) => !user_.deleted)
          .map((extUser) => (
            <View key={extUser.id} style={tw`px-2 py-1`}>
              <BoardAssignButton
                color="GREEN"
                text={extUser.firstname + " " + extUser.lastname}
                onPress={() => {
                  assignUser(extUser.id, selectedRow!.date, selectedColumn!.id);
                  closeModal?.();
                }}
              />
            </View>
          ))}
      </View>
    </>
  );
}
