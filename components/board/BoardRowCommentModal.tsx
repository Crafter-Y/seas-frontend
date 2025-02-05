import { useEffect } from "react";
import { Pressable, TextInput, View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import useAllDefaultComments from "@/hooks/api/useAllDefaultComments";
import useSingleBoardEntry from "@/hooks/api/useSingleBoardEntry";
import useUpdateComment from "@/hooks/api/useUpdateComment";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";

type Props = {
  closeModal: () => void;
  openRowModal: () => void;
  commentEditValue: string;
  setCommentEditValue: (val: string) => void;
  selectedColumn?: APIResponseColumn;
  triggerBoardRefetch: () => void;
};

export default function BoardRowCommentModal({
  closeModal,
  openRowModal,
  commentEditValue,
  setCommentEditValue,
  selectedColumn,
  triggerBoardRefetch,
}: Props) {
  const { isSm } = useMediaQueries();
  const { allDefaultComments } = useAllDefaultComments();
  const { updateComment, successfulUpdate } = useUpdateComment();
  const { selectedRow, querySingleRow } = useSingleBoardEntry();

  useEffect(() => {
    if (successfulUpdate) {
      querySingleRow(selectedRow!.date);
      closeModal();
      openRowModal();
      triggerBoardRefetch();
    }
    // TODO figure out how all used variables and functions can be included without massive duplicate invokations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successfulUpdate]);

  return (
    <View
      style={tw.style(
        {
          "px-6": isSm,
          "px-4": !isSm,
        },
        "py-6",
      )}
    >
      <Pressable>
        <TextInput
          multiline
          editable
          numberOfLines={4}
          style={tw`border rounded-lg border-gray-400 px-2 py-1 opacity-85 text-lg`}
          placeholder="Kommentar eingeben"
          value={commentEditValue}
          onChangeText={setCommentEditValue}
        />
      </Pressable>

      <View style={tw`flex-row flex-wrap gap-1 mt-1`}>
        {allDefaultComments?.map((comment) => (
          <Pressable
            key={comment.id}
            style={tw`border border-gray-400 rounded-lg py-1 px-2 flex-row items-center gap-2 max-w-full`}
            onPress={() => {
              setCommentEditValue(commentEditValue + comment.comment);
            }}
          >
            <CustomText
              style={tw`font-semibold text-green-500 text-lg`}
              selectable={false}
            >
              +
            </CustomText>
            <CustomText style={tw`font-semibold`} selectable={false}>
              {comment.comment}
            </CustomText>
          </Pressable>
        ))}
      </View>

      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button
          onPress={() => {
            closeModal();
            openRowModal();
          }}
        >
          Abbrechen
        </Button>
        <Button
          onPress={() => {
            updateComment(
              selectedRow!.date,
              selectedColumn!.id,
              commentEditValue,
            );
          }}
          color={Color.GREEN}
        >
          Speichern
        </Button>
      </View>
    </View>
  );
}
