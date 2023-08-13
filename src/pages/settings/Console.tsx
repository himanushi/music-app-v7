import { IonHeader, IonToolbar, IonContent, IonItem } from "@ionic/react";
import { Icon, Page } from "~/components";

export const Console = () => {
  return <Page>
    <IonHeader class="ion-no-border">
      <IonToolbar />
    </IonHeader>
    <IonContent fullscreen>
      <ClearCacheItem />
    </IonContent>
  </Page>;
};

const ClearCacheItem = () => {
  return <IonItem >
    <Icon name="delete" slot="start" color="red" />
    キャッシュクリア
  </IonItem>;
}
