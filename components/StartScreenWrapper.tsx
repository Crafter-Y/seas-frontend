import { useRef } from "react";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ChildType;
};

const StartScreenWrapper = ({ children }: Props) => {
  const { height } = useWindowDimensions();
  const ref = useRef<KeyboardAwareScrollView>(null);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        ref={ref}
        style={{
          height: Platform.OS !== "android" ? height : undefined,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={50}
        // TODO: something like this might be needed for very small screens - but it is just a workaround for the extraScrollHeight not working properly
        // onKeyboardDidShow={() => {
        //   setTimeout(() => {
        //     ref.current?.scrollToPosition(0, 150, true);
        //   }, 10);
        // }}
      >
        <TouchableWithoutFeedback
          onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss} // on touch browsers, it would not work otherwise
        >
          <View>{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default StartScreenWrapper;
