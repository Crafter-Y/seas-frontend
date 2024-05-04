import Modal, { ModalHandle } from "@/components/elements/Modal";
import tw from "@/tailwind";
import { Text, View } from "react-native";
import Button from "@/components/elements/Button";
import { forwardRef, MutableRefObject } from "react";

const UserCreatedModal = forwardRef<ModalHandle>((props, ref) => {
  return (
    <Modal type="CENTER" ref={ref}>
      <Text style={tw`text-center text-xl mt-6 px-4 font-semibold`}>
        Sie haben erfolgreich ein neues Mitglied erstellt. Das Mitglied hat eine
        E-Mail bekommen, über welches es ein Passwort wählen kann.
      </Text>

      <View style={tw`items-center mb-4 mt-2`}>
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
});

UserCreatedModal.displayName = "UserCreatedModal";
export default UserCreatedModal;
