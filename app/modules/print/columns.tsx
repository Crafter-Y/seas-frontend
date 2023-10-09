import CenterModal from "@/components/elements/CenterModal";
import Checkbox from "@/components/elements/Checkbox";
import useAllColumns from "@/hooks/api/useAllColumns";
import tw from "@/tailwind";
import { Text, View } from "react-native";
import { Store } from "@/helpers/store";
import Button from "@/components/elements/Button";
import { router } from "expo-router";
import { Color } from "@/helpers/Constants";

const PrintColumnSelector = () => {
  const { allColumns } = useAllColumns();

  const printColState = Store.useState((state) => state.printColumns);

  return (
    <CenterModal>
      <Text style={tw`text-center text-2xl underline my-2 font-semibold`}>
        Drucken - Spalten auswählen
      </Text>
      <View style={tw`px-4`}>
        <Checkbox
          label="Termin (Datum)"
          defaultValue={true}
          disabled={true}
          onChange={() => {}}
        />
        {allColumns.map((col) => (
          <Checkbox
            key={col.id}
            label={col.name}
            defaultValue={printColState.includes(col.id)}
            onChange={(value) => {
              Store.update((state) => {
                // TODO: it doesnt make sense, why this variable is always inverted
                if (!value) {
                  if (!printColState.includes(col.id))
                    state.printColumns.push(col.id);
                } else {
                  state.printColumns = state.printColumns.filter(
                    (el) => el != col.id
                  );
                }
              });
            }}
          />
        ))}
      </View>
      <View style={tw`justify-center flex-row gap-2 my-4`}>
        <Button onPress={router.back} color={Color.RED}>
          Abbrechen
        </Button>
        <Button
          onPress={() => {
            router.back();
            router.push("/modules/print/range");
          }}
          color={Color.BLUE}
        >
          Zurück
        </Button>
        <Button
          onPress={() => {
            router.back();
            router.push("/modules/print/order");
          }}
          color={Color.BLUE}
        >
          Weiter
        </Button>
      </View>
    </CenterModal>
  );
};

export default PrintColumnSelector;
