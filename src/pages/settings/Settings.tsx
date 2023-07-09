import {
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Icon } from "~/components";
import { Me } from ".";
import { AppleMusicAccount } from "./AppleMusicAccount";

export const Settings = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar />
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle style={{ paddingBottom: "0px" }} size="large">
              設定
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <Me />
        <AppleMusicAccount />
        <IonList>
          <IonItemDivider>アプリ</IonItemDivider>
          <IonItem button routerLink="/about">
            <Icon name="apps" slot="start" color="main" />
            <IonLabel>このアプリについて</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
