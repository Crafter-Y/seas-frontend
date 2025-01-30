import Checkbox from "@/components/elements/Checkbox";
import useAllColumns from "@/hooks/api/useAllColumns";
import tw from "@/tailwind";
import { Platform, View } from "react-native";
import { Store } from "@/helpers/store";
import Button from "@/components/elements/Button";
import { Color } from "@/helpers/Constants";
import React from "react";

type Props = {
  closeModal: () => void;
  openPrintRangeModal: () => void;
  openPrintOrderModal: () => void;
};

export default function PrintCoumnsModal({
  closeModal,
  openPrintRangeModal,
  openPrintOrderModal,
}: Props) {
  const { allColumns } = useAllColumns();

  const printColState = Store.useState((state) => state.printColumns);

  return (
    <>
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
                // TODO: it doesn't make sense, why this variable is always inverted
                if (!value) {
                  if (!printColState.includes(col.id))
                    state.printColumns.push(col.id);
                } else {
                  state.printColumns = state.printColumns.filter(
                    (el) => el !== col.id,
                  );
                }
              });
            }}
          />
        ))}
      </View>
      <View
        style={tw.style(
          { "mb-10": Platform.OS === "ios", "mb-4": Platform.OS !== "ios" }, // BUG: on iOS the button wriedly clip out the bottom
          "justify-center flex-row gap-2 mt-4",
        )}
      >
        <Button onPress={closeModal} color={Color.RED}>
          Abbrechen
        </Button>
        <Button
          onPress={() => {
            closeModal();
            openPrintRangeModal();
          }}
          color={Color.BLUE}
        >
          Zurück
        </Button>
        <Button
          onPress={() => {
            closeModal();
            openPrintOrderModal();
          }}
          color={Color.BLUE}
        >
          Weiter
        </Button>
      </View>
    </>
  );
}
