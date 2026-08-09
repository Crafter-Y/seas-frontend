import React, { use } from "react";
import { Platform, View } from "react-native";

import Button from "@/components/elements/Button";
import Checkbox from "@/components/elements/Checkbox";
import { AppContext } from "@/helpers/appContext";
import { Color } from "@/helpers/Constants";
import useAllColumns from "@/hooks/api/useAllColumns";

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
  const { printColumns, setPrintColumns } = use(AppContext);

  return (
    <>
      <View className="px-4">
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
            defaultValue={printColumns.includes(col.id)}
            onChange={(value) => {
              setPrintColumns((previous) => {
                // TODO: it doesn't make sense why this variable is always inverted
                if (!value) {
                  return previous.includes(col.id)
                    ? previous
                    : [...previous, col.id];
                }
                return previous.filter((el) => el !== col.id);
              });
            }}
          />
        ))}
      </View>
      <View
        // BUG: on iOS the button wriedly clip out the bottom
        className={`justify-center flex-row gap-2 mt-4 ${
          Platform.OS === "ios" ? "mb-10" : "mb-4"
        }`}
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
