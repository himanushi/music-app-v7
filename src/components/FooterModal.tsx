import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonModal,
  IonNote,
  IonRange,
  IonRow,
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
    <IonContent forceOverscroll={false}>
      <IonItem
        button
        detail={false}
        onClick={switchBreakpoint}
        color="black"
        lines="none"
      >
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
            <Icon size="s" color="white" slot="icon-only" name="fast_forward" />
          </IonButton>
        </IonButtons>
      </IonItem>
    </IonContent>
  );
};

const OpenModal = () => {
  return (
    <>
      <IonContent scrollY={false} forceOverscroll={false}>
        <Player />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons></IonButtons>
        </IonToolbar>
      </IonFooter>
    </>
  );
};

const Player = () => {
  return (
    <IonGrid>
      <IonRow style={{ height: "calc(100vh - 60vh)", maxHeight: "500px" }}>
        <SquareImage src={`https://picsum.photos/id/101/600`} />
      </IonRow>
      <IonRow style={{ height: "10%" }}>
        <IonItem color="black" lines="none">
          <IonLabel
            style={{ textAlign: "center" }}
            className="text-select ion-text-wrap"
          >
            タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </IonLabel>
        </IonItem>
      </IonRow>
      <PlayerSeekBar />
      <IonRow>
        <IonCol>
          <IonButton color="black" expand="full">
            <Icon name="fast_rewind" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="black" expand="full">
            <Icon name="play_arrow" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="black" expand="full">
            <Icon name="fast_forward" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonButton color="black" expand="full">
            <Icon name="favorite" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="black" expand="full">
            <Icon name="repeat" size="l" slot="icon-only" />
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const PlayerSeekBar = () => {
  return (
    <>
      <IonItem color="black" lines="none">
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
