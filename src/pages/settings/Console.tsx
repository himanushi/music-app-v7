import { useMutation } from "@apollo/client";
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  useIonToast,
  IonTitle,
  useIonActionSheet,
} from "@ionic/react";
import { Icon, Page } from "~/components";
import { ClearCacheDocument } from "~/graphql/types";

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
        <IonItem button routerLink="/roles">
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
