import Modal, { ModalHandle } from "@/components/elements/Modal";
import tw from "@/tailwind";
import { Text, View } from "react-native";
import Button from "@/components/elements/Button";
import { forwardRef, MutableRefObject } from "react";

type Props = {
  data?: APICreationReponse;
};

const UserReactivatedModal = forwardRef<ModalHandle, Props>(
  ({ data }: Props, ref) => {
    return (
      <Modal type="CENTER" ref={ref}>
        <Text
          style={tw`text-center text-2xl mt-6 px-4 font-semibold underline`}
        >
          Mitglied erfolgreich reaktiviert
        </Text>
        <View style={tw`px-4 mt-4 gap-2`}>
          <Text>
            Rolle:{" "}
            {data?.role.charAt(0).toUpperCase() +
              "" +
              data?.role.slice(1).toLowerCase()}
          </Text>
          <Text style={tw`text-lg`}>
            {data?.firstname + " " + data?.lastname + " (" + data?.email + ")"}
          </Text>
          <Text style={tw`text-lg font-bold`}>{data?.password}</Text>
        </View>
        <View style={tw`items-center mb-4`}>
          <Button
            onPress={() => {
              (ref as MutableRefObject<ModalHandle>).current.closeModal();
            }}
          >
            Fertig
          </Button>
        </View>
      </Modal>
    );
  }
);

UserReactivatedModal.displayName = "UserReactivatedModal";
export default UserReactivatedModal;
