import { useRef } from "react";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ChildType;
};

const StartScreenWrapper = ({ children }: Props) => {
  const { height } = useWindowDimensions();
  const ref = useRef<KeyboardAwareScrollViewRef>(null);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        ref={ref}
        style={{
          height: Platform.OS !== "android" ? height : undefined,
        }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={50}
        // TODO: something like this might be needed for very small screens - but it is just a workaround for the bottomOffset not working properly
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
