import React, { forwardRef, memo } from "react";
import Input from "./elements/Input";
import tw from "@/tailwind";
import { Store } from "@/helpers/store";
import Button from "./elements/Button";
import ModalRewrite, { ModalHandle } from "./elements/ModalRewrite";

const DevelopmentServerModal = forwardRef<ModalHandle>((props, ref) => {
  const serverUrl = Store.useState((state) => state.serverDevUrl);

  const localIp =
    process.env.REACT_NATIVE_PACKAGER_HOSTNAME ?? "192.168.178.95:8080";

  return (
    <ModalRewrite title="Server API URL (Development only)" ref={ref}>
      <Input
        placeholder="Server ID"
        initialValue={serverUrl}
        onChangeText={(id) =>
          Store.update((state) => {
            state.serverDevUrl = id;
          })
        }
        style={"m-2"}
      />
      <Button
        style={tw`m-2`}
        onPress={() => {
          Store.update((state) => {
            state.serverDevUrl = "http://" + localIp;
          });
        }}
      >
        {localIp}
      </Button>
      <Button
        style={tw`m-2`}
        onPress={() => {
          Store.update((state) => {
            state.serverDevUrl =
              "https://seas-kirchengemeinden.craftingapis.de";
          });
        }}
      >
        seas-kirchengemeinden.craftingapis.de
      </Button>
      <Button
        style={tw`m-2`}
        onPress={() => {
          Store.update((state) => {
            state.serverDevUrl = "https://api.seas-kirchengemeinde.de";
          });
        }}
      >
        api.seas-kirchengemeinde.de
      </Button>
    </ModalRewrite>
  );
});

DevelopmentServerModal.displayName = "DevelopmentServerModal";
export default memo(DevelopmentServerModal);
