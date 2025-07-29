import { view } from "./storybook.requires";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  //enableWebsockets: true, // Having this enabled causes the app to fail on load
});

export default StorybookUIRoot;
