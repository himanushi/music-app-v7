import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonRange,
  IonRippleEffect,
  IonRow,
  IonSegmentButton,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Icon, SquareImage } from ".";
import { useCallback, useRef, useState } from "react";
import type {
  IonModalCustomEvent,
  ModalBreakpointChangeEventDetail,
} from "@ionic/core";

// 1 にしてしまうとドラッグしても閉じない
const max = 0.99999;
const min = 0.1;

export const FooterModal = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [open, setOpen] = useState(false);

  const switchBreakpoint = useCallback(() => {
    modal.current?.setCurrentBreakpoint(open ? min : max);
    setOpen((prevOpen) => !prevOpen);
  }, [open]);

  const bcreakpointDidChange = useCallback(
    (event: IonModalCustomEvent<ModalBreakpointChangeEventDetail>) => {
      setOpen(event.detail.breakpoint === max);
    },
    []
  );

  return (
    <IonModal
      ref={modal}
      isOpen={true}
      initialBreakpoint={min}
      breakpoints={[min, max]}
      backdropDismiss={false}
      backdropBreakpoint={max}
      onIonBreakpointDidChange={bcreakpointDidChange}
    >
      {open ? (
        <OpenModal />
      ) : (
        <CloseModal switchBreakpoint={switchBreakpoint} />
      )}
    </IonModal>
  );
};

const CloseModal = ({ switchBreakpoint }: { switchBreakpoint: () => void }) => {
  return (
    <IonContent color="dark-gray" forceOverscroll={false} class="clickable">
      <IonHeader class="ion-no-border">
        <IonToolbar onClick={switchBreakpoint} color="dark-gray">
          <IonThumbnail>
            <img src={`https://picsum.photos/id/101/300`} />
          </IonThumbnail>
          <IonTitle>
            タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </IonTitle>
          <IonButtons onClick={(event) => event.stopPropagation()} slot="end">
            <IonButton>
              <Icon size="s" color="white" slot="icon-only" name="play_arrow" />
            </IonButton>
            <IonButton>
              <Icon
                size="s"
                color="white"
                slot="icon-only"
                name="fast_forward"
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </IonContent>
  );
};

const OpenModal = () => {
  return (
    <>
      <IonContent color="dark-gray" scrollY={false} forceOverscroll={false}>
        <Player />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons>
            <IonSegmentButton layout="icon-top" value="default">
              <Icon name="queue_music" slot="start" color="white" />
            </IonSegmentButton>
            <IonSegmentButton value="segment">
              <Icon name="music_note" color="red" size="s" />
            </IonSegmentButton>
            <IonSegmentButton value="aa">
              <IonButton color="dark-gray" size="small">
                <Icon name="queue_music" color="white" />
                <IonRippleEffect type="unbounded" />
              </IonButton>
            </IonSegmentButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </>
  );
};

const Player = () => {
  return (
    <IonGrid style={{ height: "100%" }}>
      <IonRow style={{ height: "40%", maxHeight: "500px" }}>
        <SquareImage src={`https://picsum.photos/id/101/600`} />
      </IonRow>
      <IonRow style={{ height: "10%" }}>
        <IonItem color="dark-gray" lines="none">
          <IonLabel className="text-select ion-text-wrap">
            タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </IonLabel>
        </IonItem>
      </IonRow>
      <div style={{ height: "18%" }}>
        <PlayerSeekBar />
      </div>
      <IonRow style={{ height: "15%" }} class="ion-text-center">
        <IonCol>
          <IonButton color="dark-gray" size="large">
            <Icon name="fast_rewind" size="l" slot="icon-only" color="white" />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="dark-gray" size="large">
            <Icon name="play_arrow" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="dark-gray" size="large">
            <Icon name="fast_forward" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow class="ion-text-center">
        <IonCol>
          <IonButton color="dark-gray" size="large">
            <Icon name="favorite" color="red" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="dark-gray" size="large">
            <Icon name="repeat" color="main" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const PlayerSeekBar = () => {
  return (
    <>
      <IonItem color="dark-gray" lines="none">
        <IonNote slot="start">00:00</IonNote>
        <IonNote slot="end">00:30</IonNote>
      </IonItem>
      <IonRange
        pinFormatter={toMMSS}
        class="player-seek-bar"
        value={15000}
        max={30000}
        min={0}
        pin
      />
    </>
  );
};

const toMMSS = (duration: number) => {
  const sec = Math.floor(duration / 1000);
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;

  const padding = (num: number) => `0${num}`.slice(-2);

  return `${padding(minutes)}:${padding(seconds)}`;
};
