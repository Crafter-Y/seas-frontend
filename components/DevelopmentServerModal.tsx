import React, { forwardRef, memo, useContext } from "react";

import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import { AppContext } from "@/helpers/appContext";

const DevelopmentServerModal = forwardRef<ModalHandle>((props, ref) => {
  const { serverDevUrl, setDevUrl } = useContext(AppContext);

  const localIp =
    process.env.REACT_NATIVE_PACKAGER_HOSTNAME ?? "192.168.178.95:8080";

  return (
    <ModalRewrite title="modal.apiEndpointUrl" ref={ref}>
      <Input
        placeholder="Server ID"
        initialValue={serverDevUrl}
        onChangeText={(url) => {
          setDevUrl(url);
        }}
        className="m-2"
        testID="dev-server-url-input"
      />
      <Button
        className="m-2"
        onPress={() => {
          setDevUrl("http://" + localIp);
        }}
      >
        {localIp}
      </Button>
      <Button
        className="m-2"
        onPress={() => {
          setDevUrl("https://seas-kirchengemeinden.craftingapis.de");
        }}
      >
        seas-kirchengemeinden.craftingapis.de
      </Button>
      <Button
        className="m-2"
        onPress={() => {
          setDevUrl("http://api.localhost");
        }}
      >
        api.localhost
      </Button>
      <Button
        className="m-2"
        onPress={() => {
          setDevUrl("https://api.seas-kirchengemeinde.de");
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
