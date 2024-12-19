import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PrintCoumnsModal from "./PrintCoumnsModal";
import PrintOrderModal from "./PrintOrderModal";
import PrintRangeModal from "./PrintRangeModal";

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
      <ModalRewrite title="modal.print.chooseRange" ref={printRangeModal}>
        <PrintRangeModal
          closeModal={() => printRangeModal.current?.closeModal()}
          openColumnsModal={() => printColumnsModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite
        title="modal.print.chooseColumns"
        ref={printColumnsModal}
        scrollable
      >
        <PrintCoumnsModal
          closeModal={() => printColumnsModal.current?.closeModal()}
          openPrintRangeModal={() => printRangeModal.current?.openModal()}
          openPrintOrderModal={() => printOrderModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite
        title="modal.print.changeOrder"
        ref={printOrderModal}
        scrollable
      >
        <PrintOrderModal
          closeModal={() => printOrderModal.current?.closeModal()}
          openColumnsModal={() => printColumnsModal.current?.openModal()}
        />
      </ModalRewrite>
    </>
  );
});

PrintModalContainer.displayName = "PrintModalContainer";
export default PrintModalContainer;
