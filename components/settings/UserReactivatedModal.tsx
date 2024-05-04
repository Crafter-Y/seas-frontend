import Modal, { ModalHandle } from "@/components/elements/Modal";
import tw from "@/tailwind";
import { Text, View } from "react-native";
import Button from "@/components/elements/Button";
import { forwardRef, MutableRefObject } from "react";

const UserReactivatedModal = forwardRef<ModalHandle>((props, ref) => {
  return (
    <Modal type="CENTER" ref={ref}>
      <Text style={tw`text-center text-xl mt-6 px-4 font-semibold`}>
        Sie haben das Mitglied erfolgreich reaktiviert. Damit das Mitglied den
        Account verwenden kann, hat es per E-Mail einen Link erhalten.
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

UserReactivatedModal.displayName = "UserReactivatedModal";
export default UserReactivatedModal;
