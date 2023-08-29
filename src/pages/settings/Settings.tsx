import {
  IonCard,
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
      <IonHeader translucent>
        <IonToolbar
          style={{ "--border-width": 0, "--ion-color-step-50": "#000" }}
        >
          <IonTitle>設定</IonTitle>
        </IonToolbar>
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
        <IonCard>
          <IonItem button routerLink="/about" color="dark-gray">
            <IonLabel>このアプリについて</IonLabel>
          </IonItem>
          <IonItem button routerLink="/teams" color="dark-gray">
            <IonLabel>利用規約</IonLabel>
          </IonItem>
          <IonItem button routerLink="/privacy" color="dark-gray">
            <IonLabel>プライバシーポリシー</IonLabel>
          </IonItem>
          <IonItem button routerLink="/cookie-policy" color="dark-gray">
            <IonLabel>クッキーポリシー</IonLabel>
          </IonItem>
          {isAllowed("console") && (
            <IonItem button routerLink="/console" color="dark-gray">
              <IonLabel color="red">コンソール</IonLabel>
            </IonItem>
          )}
          <IonItem button routerLink="/cache" color="dark-gray">
            <IonNote>キャッシュ</IonNote>
          </IonItem>
        </IonCard>
      </IonContent>
    </Page>
  );
};
