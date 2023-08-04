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
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useEffect, useState } from "react";
import { Icon } from "~/components";
import { useMusicKit } from "~/hooks";

export const Library = () => {
  const { isAuthorized } = useMusicKit();
  const [hasSubscription, setHasSubscription] = useState(false);
  useEffect(() => {
    if (!isAuthorized) return;
    CapacitorMusicKit.hasMusicSubscription().then((hasSubscription) => {
      setHasSubscription(hasSubscription.result);
    });
  }, [isAuthorized]);

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
              ライブラリ
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem
            disabled={!hasSubscription}
            button
            routerLink="/library-artists"
          >
            <Icon name="mic" slot="start" color="red" />
            <IonLabel>ライブラリアーティスト</IonLabel>
          </IonItem>
          <IonItem
            disabled={!hasSubscription}
            button
            routerLink="/library-albums"
          >
            <Icon name="art_track" slot="start" color="red" />
            <IonLabel>ライブラリアルバム</IonLabel>
          </IonItem>
          <IonItem
            disabled={!hasSubscription}
            button
            routerLink="/library-tracks"
          >
            <Icon name="music_note" slot="start" color="red" />
            <IonLabel>ライブラリ曲</IonLabel>
          </IonItem>
          <IonItem
            disabled={!hasSubscription}
            button
            routerLink="/library-playlists"
          >
            <Icon name="queue_music" slot="start" color="red" />
            <IonLabel>ライブラリプレイリスト</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
