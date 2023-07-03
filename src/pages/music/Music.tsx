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
      <IonHeader>
        <IonToolbar />
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle style={{ paddingBottom: "0px" }} size="large">
              ゲーム音楽
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem button routerLink="/artists">
            <Icon name="group" slot="start" color="main" />
            <IonLabel>アーティスト</IonLabel>
          </IonItem>
          <IonItem button routerLink="/albums">
            <Icon name="album" slot="start" color="main" />
            <IonLabel>アルバム</IonLabel>
          </IonItem>
          <IonItem button routerLink="/tracks">
            <Icon name="music_note" slot="start" color="main" />
            <IonLabel>曲</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
