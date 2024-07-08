import tw from "@/tailwind";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ChildType;
};

const StartScreenWrapper = ({ children }: Props) => {
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        scrollEnabled={false}
        style={tw`h-full`}
        extraScrollHeight={75}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback
          onPress={Platform.OS == "web" ? undefined : Keyboard.dismiss} // on touch browsers, it would not work otherwise
        >
          <View>{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default StartScreenWrapper;
