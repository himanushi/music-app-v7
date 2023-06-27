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

export const FooterModal = () => {
  return (
    <IonModal
      isOpen={true}
      initialBreakpoint={0.1}
      breakpoints={[0.1, 0.95]}
      backdropDismiss={false}
      backdropBreakpoint={0.9}
    >
      <IonContent forceOverscroll={false}>
        <IonItem color="black" lines="none">
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
              <Icon
                size="s"
                color="white"
                slot="icon-only"
                name="fast_forward"
              />
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};
