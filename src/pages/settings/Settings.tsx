import {
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Me } from ".";
import { AppleMusicAccount } from "./AppleMusicAccount";
import { Page } from "~/components";
import { useMe } from "~/hooks";

export const Settings = () => {
  const { isAllowed } = useMe();

  return (
    <Page>
      <IonHeader>
        <IonToolbar
          style={{ "--border-width": 0, "--ion-color-step-50": "#000" }}
        />
      </IonHeader>
      <IonContent fullscreen>
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
          {
            isAllowed("console") && <IonItem button routerLink="/console">
              <IonLabel color="red">コンソール</IonLabel>
            </IonItem>
          }
          <IonItem button routerLink="/cache">
            <IonNote>キャッシュ</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </Page>
  );
};
