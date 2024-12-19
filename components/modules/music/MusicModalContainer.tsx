import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import React, { forwardRef, memo, useImperativeHandle, useRef } from "react";
import MusicActionModal from "./MusicActionModal";
import MusicEntryDateModal from "./MusicEntryDateModal";
import MusicEntryOverviewModal from "./MusicEntryOverviewModal";
import MusicEntryRatingModal from "./MusicEntryRatingModal";
import MusicEntryTypeModal from "./MusicEntryTypeModal";
import MusicHistoryModal from "./MusicHistoryModal";
import MusicSelectSongModal from "./MusicSelectSongModal";

const MusicModalContainer = forwardRef<ModalHandle>((props, ref) => {
  const musicActonModal = useRef<ModalHandle>(null);

  const entryTypeModal = useRef<ModalHandle>(null);
  const entryDateModal = useRef<ModalHandle>(null);
  const selectSongModal = useRef<ModalHandle>(null);
  const rateSongModal = useRef<ModalHandle>(null);
  const overviewModal = useRef<ModalHandle>(null);

  const historyModal = useRef<ModalHandle>(null);

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
      <ModalRewrite title="modal.music.seasMusicJournal" ref={musicActonModal}>
        <MusicActionModal
          closeModal={() => musicActonModal.current?.closeModal()}
          openEntryTypeModal={() => entryTypeModal.current?.openModal()}
          openOverviewModal={() => overviewModal.current?.openModal()}
          openHistoryModal={() => historyModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="modal.music.seasMusicJournal" ref={entryTypeModal}>
        <MusicEntryTypeModal
          closeModal={() => entryTypeModal.current?.closeModal()}
          openMusicActionModal={() => musicActonModal.current?.openModal()}
          openEntryDateModal={() => entryDateModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="modal.music.seasMusicJournal" ref={entryDateModal}>
        <MusicEntryDateModal
          closeModal={() => entryDateModal.current?.closeModal()}
          openMusicEntryTypeModal={() => entryTypeModal.current?.openModal()}
          openMusicSelectonModal={() => selectSongModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite
        title="modal.music.enterSong"
        ref={selectSongModal}
        scrollable
      >
        <MusicSelectSongModal
          closeModal={() => selectSongModal.current?.closeModal()}
          openEntryDateModal={() => entryDateModal.current?.openModal()}
          openRatingsModal={() => rateSongModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="modal.music.giveRating" ref={rateSongModal}>
        <MusicEntryRatingModal
          closeModal={() => rateSongModal.current?.closeModal()}
          openSelectSongModal={() => selectSongModal.current?.openModal()}
          openOverviewModal={() => overviewModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="overview" ref={overviewModal} scrollable>
        <MusicEntryOverviewModal
          closeModal={() => overviewModal.current?.closeModal()}
          openSelectSongModal={() => selectSongModal.current?.openModal()}
        />
      </ModalRewrite>
      <ModalRewrite title="modal.music.reports" ref={historyModal} scrollable>
        <MusicHistoryModal />
      </ModalRewrite>
    </>
  );
});

MusicModalContainer.displayName = "MusicModalContainer";
export default memo(MusicModalContainer);
