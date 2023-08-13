import { useMutation } from "@apollo/client";
import { IonHeader, IonToolbar, IonContent, IonItem, useIonToast, IonTitle } from "@ionic/react";
import { Icon, Page } from "~/components";
import { ClearCacheDocument } from "~/graphql/types";

export const Console = () => {
  return <Page>
    <IonHeader class="ion-no-border">
      <IonToolbar>
        <IonTitle>コンソール</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <ClearCacheItem />
    </IonContent>
  </Page>;
};

const ClearCacheItem = () => {
  const [clear] = useMutation(ClearCacheDocument);
  const [present] = useIonToast();

  return <IonItem button onClick={async () => {
    await clear({
      variables: { input: {} },
    });
    await present({
      message: "キャッシュをクリアしました",
      duration: 2000,
      position: "top",
    })
  }}>
    <Icon name="delete" slot="start" color="red" />
    キャッシュクリア
  </IonItem>;
}
