import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonModal,
  IonRow,
  IonThumbnail,
  IonTitle,
} from "@ionic/react";
import { Icon, SquareImage } from ".";
import { useCallback, useRef, useState } from "react";
import type {
  IonModalCustomEvent,
  ModalBreakpointChangeEventDetail,
} from "@ionic/core";

const min = 0.1;
const max = 0.95;

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
      <IonContent forceOverscroll={false}>
        {open ? (
          <OpenPlayer />
        ) : (
          <ClosePlayer switchBreakpoint={switchBreakpoint} />
        )}
      </IonContent>
    </IonModal>
  );
};

const ClosePlayer = ({
  switchBreakpoint,
}: {
  switchBreakpoint: () => void;
}) => {
  return (
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
  );
};

const OpenPlayer = () => {
  return (
    <>
      <IonRow>
        <SquareImage src={`https://picsum.photos/id/101/600`} />
      </IonRow>
      <IonItem color="black" lines="none" className="ion-no-margin">
        <h4 style={{ textAlign: "center" }} className="text-select">
          タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル
        </h4>
      </IonItem>
      <IonGrid>
        <IonRow>
          <IonCol style={{ textAlign: "center" }}>
            <IonButton color="black" size="large">
              <Icon name="fast_forward" size="l" slot="icon-only" />
            </IonButton>
          </IonCol>
          <IonCol style={{ textAlign: "center" }}>
            <IonButton color="black" size="large">
              <Icon name="play_arrow" size="l" slot="icon-only" />
            </IonButton>
          </IonCol>
          <IonCol style={{ textAlign: "center" }}>
            <IonButton color="black" size="large">
              <Icon name="fast_forward" size="l" slot="icon-only" />
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol style={{ textAlign: "center" }}>
            <IonButton color="black" size="large">
              <Icon name="favorite" color="red" size="l" slot="icon-only" />
            </IonButton>
          </IonCol>
          <IonCol style={{ textAlign: "center" }}>
            <IonButton color="black" size="large">
              <Icon name="repeat" size="l" slot="icon-only" />
            </IonButton>
          </IonCol>
          <IonCol style={{ textAlign: "center" }}>
            <IonButton color="black" size="large">
              <Icon name="shuffle" color="main" size="l" slot="icon-only" />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};
