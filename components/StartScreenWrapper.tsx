import tw from "@/tailwind";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default StartScreenWrapper;
