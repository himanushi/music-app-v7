import { useMutation } from "@apollo/client";
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  useIonToast,
  IonTitle,
  useIonActionSheet,
  useIonLoading,
} from "@ionic/react";
import { Icon, Page } from "~/components";
import {
  ClearCacheDocument,
  IgnoreAlbumsDocument,
  IgnoreArtistsDocument,
} from "~/graphql/types";

export const Console = () => {
  return (
    <Page>
      <IonHeader class="ion-no-border">
        <IonToolbar>
          <IonTitle>コンソール</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ClearCacheItem />
        <AllIgnoresItem />
        <IonItem button routerLink="/roles">
          <Icon name="key" slot="start" color="blue" />
          権限
        </IonItem>
      </IonContent>
    </Page>
  );
};

const ClearCacheItem = () => {
  const [open] = useIonActionSheet();
  const [clear] = useMutation(ClearCacheDocument);
  const [toast] = useIonToast();

  return (
    <IonItem
      button
      onClick={() =>
        open({
          buttons: [
            {
              text: "キャッシュクリア",
              role: "destructive",
              data: {
                action: "CLEAR",
              },
            },
            {
              text: "キャンセル",
              role: "cancel",
              data: {
                action: "CANCEL",
              },
            },
          ],
          onDidDismiss: async ({ detail }) => {
            if (!["CLEAR"].includes(detail.data?.action)) return;
            await clear({
              variables: { input: {} },
            });
            await toast({
              message: "キャッシュをクリアしました",
              duration: 2000,
              position: "top",
            });
          },
        })
      }
    >
      <Icon name="delete" slot="start" color="red" />
      キャッシュクリア
    </IonItem>
  );
};

const AllIgnoresItem = () => {
  const [loading, loaded] = useIonLoading();
  const [open] = useIonActionSheet();
  const [ignoreArtists] = useMutation(IgnoreArtistsDocument);
  const [ignoreAlbums] = useMutation(IgnoreAlbumsDocument);
  const [toast] = useIonToast();

  return (
    <IonItem
      button
      onClick={() =>
        open({
          buttons: [
            {
              text: "除外する",
              role: "destructive",
              data: {
                action: "CLEAR",
              },
            },
            {
              text: "キャンセル",
              role: "cancel",
              data: {
                action: "CANCEL",
              },
            },
          ],
          onDidDismiss: async ({ detail }) => {
            if (!["CLEAR"].includes(detail.data?.action)) return;
            await loading();
            await ignoreArtists({ variables: { input: {} } });
            await ignoreAlbums({ variables: { input: {} } });
            await loaded();
            await toast({
              message: "除外しました",
              duration: 2000,
              position: "top",
            });
          },
        })
      }
    >
      <Icon name="info" slot="start" color="red" />
      アーティストとアルバムの保留を全て除外する
    </IonItem>
  );
};
