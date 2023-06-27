import {
  IonButton,
  IonButtons,
  IonContent,
  IonItem,
  IonModal,
  IonThumbnail,
  IonTitle,
} from "@ionic/react";
import { Icon } from ".";
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
    <IonItem onClick={switchBreakpoint} color="black" lines="none">
      <IonThumbnail>
        <img src={`https://picsum.photos/id/101/300`} />
      </IonThumbnail>
      <IonTitle>
        タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル
      </IonTitle>
      <IonButtons slot="end">
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
  return <></>;
};
