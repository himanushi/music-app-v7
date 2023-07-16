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

export const Library = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar />
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle style={{ paddingBottom: "0px" }} size="large">
              ライブラリ
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem button routerLink="/library-artists">
            <Icon name="group" slot="start" color="red" />
            <IonLabel>ライブラリアーティスト</IonLabel>
          </IonItem>
          <IonItem button routerLink="/library-albums">
            <Icon name="album" slot="start" color="red" />
            <IonLabel>ライブラリアルバム</IonLabel>
          </IonItem>
          <IonItem button routerLink="/library-tracks">
            <Icon name="music_note" slot="start" color="red" />
            <IonLabel>ライブラリ曲</IonLabel>
          </IonItem>
          <IonItem button routerLink="/library-playlists">
            <Icon name="playlist_play" slot="start" color="red" />
            <IonLabel>ライブラリプレイリスト</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
