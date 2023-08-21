import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Icon } from "~/components";

export const Music = () => {
  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar
          style={{ "--border-width": 0, "--ion-color-step-50": "#000" }}
        />
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle style={{ paddingBottom: "0px" }} size="large">
              見つける
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem button routerLink="/artists">
            <Icon name="mic" slot="start" color="main" />
            <IonLabel>アーティスト</IonLabel>
          </IonItem>
          <IonItem button routerLink="/">
            <Icon name="art_track" slot="start" color="main" />
            <IonLabel>アルバム</IonLabel>
          </IonItem>
          <IonItem button routerLink="/tracks">
            <Icon name="music_note" slot="start" color="main" />
            <IonLabel>曲</IonLabel>
          </IonItem>
          <IonItem button routerLink="/playlists">
            <Icon name="queue_music" slot="start" color="main" />
            <IonLabel>共有プレイリスト</IonLabel>
          </IonItem>
          <IonItem button routerLink="/my-playlists">
            <Icon name="queue_music" slot="start" color="main" />
            <IonLabel>マイプレイリスト</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
