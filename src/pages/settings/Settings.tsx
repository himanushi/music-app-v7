import {
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Me } from ".";
import { AppleMusicAccount } from "./AppleMusicAccount";
import { FooterPadding } from "~/components";

export const Settings = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{ "--border-width": 0, "--ion-color-step-50": "#000" }}
        />
        <IonToolbar
          style={{ "--border-width": 0, "--ion-color-step-50": "#000" }}
        />
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
            <IonLabel>このアプリについて</IonLabel>
          </IonItem>
          <IonItem button routerLink="/teams">
            <IonLabel>利用規約</IonLabel>
          </IonItem>
          <IonItem button routerLink="/privacy">
            <IonLabel>プライバシーポリシー</IonLabel>
          </IonItem>
          <IonItem button routerLink="/cookie-policy">
            <IonLabel>クッキーポリシー</IonLabel>
          </IonItem>
          <IonItem button routerLink="/cache">
            <IonNote>キャッシュ</IonNote>
          </IonItem>
        </IonList>
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};
