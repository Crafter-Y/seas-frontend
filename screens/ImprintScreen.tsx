import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "@/navigator/RootNavigator";
import tw from "@/tailwind";

type ImprintScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ImprintScreen"
>;

const ImprintScreen = () => {
  const navigation = useNavigation<ImprintScreenProps>();

  useEffect(() => {
    navigation.setOptions({ title: "Impressum", headerShown: true });
  }, [navigation]);

  return (
    <SafeAreaView style={{ margin: 0, padding: 0 }}>
      <View style={tw`px-4 gap-2 pt-4`}>
        <Text
          style={tw`text-4xl font-bold opacity-95 underline underline-offset-2 decoration-blueAccent`}
        >
          Impressum
        </Text>
        <Text>Angaben gemäß § 5 TMG</Text>
        <Text>Helmut Haase</Text>
        <Text>Am Hohlweg 17</Text>
        <Text>58256 Ennepetal</Text>

        <Text style={tw`font-semibold text-lg`}>Vertreten durch:</Text>
        <Text>Helmut Haase</Text>

        <Text style={tw`font-semibold text-lg`}>Kontakt:</Text>
        <Text>Telefon: +49 177 3764645</Text>
        <Text>E-Mail: helmut_h_haase@yahoo.de</Text>

        <Text style={tw`font-semibold text-lg`}>Haftungsausschluss:</Text>
        <Text style={tw`font-semibold`}>Haftung für Inhalte</Text>
        <Text style={tw`max-w-md`}>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
          die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
          jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7
          Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
          gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
          forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          von entsprechenden Rechtsverletzungen werden wir diese Inhalte
          umgehend entfernen.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ImprintScreen;
