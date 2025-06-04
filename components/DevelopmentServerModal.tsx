import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { forwardRef, memo } from "react";

import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import { Store } from "@/helpers/store";

const DevelopmentServerModal = forwardRef<ModalHandle>((props, ref) => {
  const serverUrl = Store.useState((state) => state.serverDevUrl);

  const localIp =
    process.env.REACT_NATIVE_PACKAGER_HOSTNAME ?? "192.168.178.95:8080";

  return (
    <ModalRewrite title="modal.apiEndpointUrl" ref={ref}>
      <Input
        placeholder="Server ID"
        initialValue={serverUrl}
        onChangeText={(url) => {
          AsyncStorage.setItem("devServerURL", url);
          Store.update((state) => {
            state.serverDevUrl = url;
          });
        }}
        className="m-2"
        testID="dev-server-url-input"
      />
      <Button
        className="m-2"
        onPress={() => {
          AsyncStorage.setItem("devServerURL", "http://" + localIp);
          Store.update((state) => {
            state.serverDevUrl = "http://" + localIp;
          });
        }}
      >
        {localIp}
      </Button>
      <Button
        className="m-2"
        onPress={() => {
          AsyncStorage.setItem(
            "devServerURL",
            "https://seas-kirchengemeinden.craftingapis.de",
          );
          Store.update((state) => {
            state.serverDevUrl =
              "https://seas-kirchengemeinden.craftingapis.de";
          });
        }}
      >
        seas-kirchengemeinden.craftingapis.de
      </Button>
      <Button
        className="m-2"
        onPress={() => {
          AsyncStorage.setItem(
            "devServerURL",
            "https://api.seas-kirchengemeinde.de",
          );
          Store.update((state) => {
            state.serverDevUrl = "https://api.seas-kirchengemeinde.de";
          });
        }}
        testID="public-api-button"
      >
        api.seas-kirchengemeinde.de
      </Button>
    </ModalRewrite>
  );
});

DevelopmentServerModal.displayName = "DevelopmentServerModal";
export default memo(DevelopmentServerModal);
