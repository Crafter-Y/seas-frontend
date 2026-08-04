import { RefObject } from "react";
import { View } from "react-native";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Modal, { ModalHandle } from "@/components/elements/Modal";

type Props = {
  ref?: RefObject<ModalHandle | null>;
};

const UserReactivatedModal = ({ ref }: Props) => {
  return (
    <Modal type="CENTER" ref={ref}>
      <CustomText className="text-center text-xl mt-6 px-4 font-semibold">
        Sie haben das Mitglied erfolgreich reaktiviert. Damit das Mitglied den
        Account verwenden kann, hat es per E-Mail einen Link erhalten.
      </CustomText>
      <View className="items-center mb-4 mt-2">
        <Button
          onPress={() => {
            ref?.current?.closeModal();
          }}
        >
          Fertig
        </Button>
      </View>
    </Modal>
  );
};

UserReactivatedModal.displayName = "UserReactivatedModal";
export default UserReactivatedModal;
