import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import PrintRangeModal from "./PrintRangeModal";
import PrintCoumnsModal from "./PrintCoumnsModal";
import PrintOrderModal from "./PrintOrderModal";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";

const PrintModalContainer = forwardRef<ModalHandle>((props, ref) => {
  const printRangeModal = useRef<ModalHandle>(null);
  const printColumnsModal = useRef<ModalHandle>(null);
  const printOrderModal = useRef<ModalHandle>(null);

  useImperativeHandle(ref, () => ({
    openModal() {
      printRangeModal.current?.openModal();
    },
    closeModal() {
      printRangeModal.current?.closeModal();
    },
  }));

  return (
    <>
      <ModalRewrite title="Drucken - Zeitraum auswählen" ref={printRangeModal}>
        <PrintRangeModal
          closeModal={() => printRangeModal.current?.closeModal()}
          openColumnsModal={() => printColumnsModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite
        title="Drucken - Spalten auswählen"
        ref={printColumnsModal}
        scrollable
      >
        <PrintCoumnsModal
          closeModal={printColumnsModal.current?.closeModal}
          openPrintRangeModal={printRangeModal.current?.openModal}
          openPrintOrderModal={printOrderModal.current?.openModal}
        />
      </ModalRewrite>
      <ModalRewrite
        title="Drucken - Reihenfolge ändern"
        ref={printOrderModal}
        scrollable
      >
        <PrintOrderModal
          closeModal={printOrderModal.current?.closeModal}
          openColumnsModal={printColumnsModal.current?.openModal}
        />
      </ModalRewrite>
    </>
  );
});

PrintModalContainer.displayName = "PrintModalContainer";
export default memo(PrintModalContainer);
