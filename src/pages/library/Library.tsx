import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Icon, JoinAppleMusicItem, Page } from "~/components";
import { useMusicKit } from "~/hooks";

export const Library = () => {
  const { hasMusicSubscription } = useMusicKit();

  return (
    <Page>
      <IonHeader translucent>
        <IonToolbar
          style={{ "--border-width": 0, "--ion-color-step-50": "#000" }}
        />
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle style={{ paddingBottom: "0px" }} size="large">
              ライブラリ
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem
            disabled={!hasMusicSubscription}
            button
            routerLink="/library-albums"
          >
            <Icon name="photo_library" slot="start" color="red" />
            <IonLabel>ライブラリアルバム</IonLabel>
          </IonItem>
          <JoinAppleMusicItem />
        </IonList>
      </IonContent>
    </Page>
  );
};
