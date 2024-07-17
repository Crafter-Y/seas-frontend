import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import MusicActionModal from "./MusicActionModal";
import MusicEntryTypeModal from "./MusicEntryTypeModal";
import MusicEntryDateModal from "./MusicEntryDateModal";
import MusicSelectSongModal from "./MusicSelectSongModal";
import MusicEntryRatingModal from "./MusicEntryRatingModal";
import MusicEntryOverviewModal from "./MusicEntryOverviewModal";

const MusicModalContainer = forwardRef<ModalHandle>((props, ref) => {
  const musicActonModal = useRef<ModalHandle>(null);

  const entryTypeModal = useRef<ModalHandle>(null);
  const entryDateModal = useRef<ModalHandle>(null);
  const selectSongModal = useRef<ModalHandle>(null);
  const rateSongModal = useRef<ModalHandle>(null);
  const overviewModal = useRef<ModalHandle>(null);

  useImperativeHandle(ref, () => ({
    openModal() {
      musicActonModal.current?.openModal();
    },
    closeModal() {
      musicActonModal.current?.closeModal();
    },
  }));

  return (
    <>
      <ModalRewrite title="SEAS Musik Journal" ref={musicActonModal}>
        <MusicActionModal
          closeModal={() => musicActonModal.current?.closeModal()}
          openEntryTypeModal={() => entryTypeModal.current?.openModal()}
          openOverviewModal={() => overviewModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="SEAS Musik Journal" ref={entryTypeModal}>
        <MusicEntryTypeModal
          closeModal={() => entryTypeModal.current?.closeModal()}
          openMusicActionModal={() => musicActonModal.current?.openModal()}
          openEntryDateModal={() => entryDateModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="SEAS Musik Journal" ref={entryDateModal}>
        <MusicEntryDateModal
          closeModal={() => entryDateModal.current?.closeModal()}
          openMusicEntryTypeModal={() => entryTypeModal.current?.openModal()}
          openMusicSelectonModal={() => selectSongModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="Lied eingeben" ref={selectSongModal} scrollable>
        <MusicSelectSongModal
          closeModal={() => selectSongModal.current?.closeModal()}
          openEntryDateModal={() => entryDateModal.current?.openModal()}
          openRatingsModal={() => rateSongModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="Bewertung abgeben" ref={rateSongModal}>
        <MusicEntryRatingModal
          closeModal={() => rateSongModal.current?.closeModal()}
          openSelectSongModal={() => selectSongModal.current?.openModal()}
          openOverviewModal={() => overviewModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="Überblick" ref={overviewModal} scrollable>
        <MusicEntryOverviewModal
          closeModal={() => overviewModal.current?.closeModal()}
          openSelectSongModal={() => selectSongModal.current?.openModal()}
        />
      </ModalRewrite>
    </>
  );
});

MusicModalContainer.displayName = "MusicModalContainer";
export default memo(MusicModalContainer);
