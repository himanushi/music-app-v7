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
  RangeKnobMoveStartEventDetail,
} from "@ionic/react";
import { Icon, SquareImage } from ".";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  IonModalCustomEvent,
  ModalBreakpointChangeEventDetail,
} from "@ionic/core";
import { useHistory } from "react-router-dom";

// 1 にしてしまうとドラッグしても閉じない
const max = 0.99999;
const min = 0.15;

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
  const history = useHistory();

  return (
    <IonContent color="dark-gray" forceOverscroll={false} class="clickable">
      <IonHeader class="ion-no-border">
        <IonToolbar
          onClick={switchBreakpoint}
          color="dark-gray"
          class="clickable"
        >
          <IonThumbnail>
            <img src={`https://picsum.photos/id/101/300`} />
          </IonThumbnail>
          <IonTitle className="label-long-text">
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
        <IonToolbar color="dark-gray">
          <IonButtons>
            <IonSegmentButton
              onClick={() =>
                history.location.pathname !== "/music" && history.push("/music")
              }
            >
              <IonButton>
                <Icon name="music_note" slot="start" />
              </IonButton>
              見つける
            </IonSegmentButton>
            <IonSegmentButton
              onClick={() =>
                history.location.pathname !== "/library" &&
                history.push("/library")
              }
            >
              <IonButton>
                <Icon name="library_music" slot="start" />
              </IonButton>
              ライブラリ
            </IonSegmentButton>
            <IonSegmentButton
              onClick={() =>
                history.location.pathname !== "/settings" &&
                history.push("/settings")
              }
            >
              <IonButton>
                <Icon name="settings" slot="start" />
              </IonButton>
              設定
            </IonSegmentButton>
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
      <IonRow style={{ height: "50%", maxHeight: "500px" }} class="ion-padding">
        <SquareImage src={`https://picsum.photos/id/101/600`} />
      </IonRow>
      <IonRow>
        <IonItem color="dark-gray" lines="none">
          <IonLabel class="ion-text-wrap">
            タイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </IonLabel>
        </IonItem>
      </IonRow>
      <div style={{ height: "13%" }}>
        <PlayerSeekBar />
      </div>
      <IonRow style={{ height: "13%" }} class="ion-text-center">
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
  const [seek, setSeek] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setSeek((prevSeek) => prevSeek + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seeking) return;
    setSeekValue(seek);
  }, [seeking, seek]);

  const onStart = useCallback(
    (event: CustomEvent<RangeKnobMoveStartEventDetail>) => {
      setSeeking(true);

      if (typeof event.detail.value === "number") {
        setSeekValue(event.detail.value);
      }
    },
    []
  );

  const onStop = useCallback(
    (event: CustomEvent<RangeKnobMoveStartEventDetail>) => {
      setSeeking(false);

      if (typeof event.detail.value === "number") {
        setSeek(event.detail.value);
      }
    },
    []
  );

  const Range = useMemo(
    () => (
      <IonRange
        pinFormatter={toMMSS}
        class="player-seek-bar ion-no-padding"
        value={seekValue}
        max={60000}
        min={0}
        pin
        onIonKnobMoveStart={onStart}
        onIonKnobMoveEnd={onStop}
      />
    ),
    [onStart, onStop, seekValue]
  );

  const Time = useMemo(() => {
    return (
      <IonItem color="dark-gray" lines="none">
        <IonNote slot="start">00:00</IonNote>
        <IonNote slot="end">00:30</IonNote>
      </IonItem>
    );
  }, []);

  return (
    <>
      {Time}
      {Range}
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
