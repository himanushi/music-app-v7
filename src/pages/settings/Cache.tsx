import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonTitle,
  IonButton,
} from "@ionic/react";
import { client } from "~/graphql/client";
import { NormalizedCacheObject } from "@apollo/client";
import { Page } from "~/components";

export const Cache = () => {
  const [cacheData, setCacheData] = useState<NormalizedCacheObject>({});
  const get = () => {
    const data = client.current?.extract() || {};
    setCacheData(data);
  };
  const clear = () => {
    client.current?.cache.reset();
    setCacheData({});
  };

  return (
    <Page>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Apollo Client Cache</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Cache Data</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton onClick={get}>Get Cache Data</IonButton>
            <IonButton onClick={clear} color="red">
              Clear
            </IonButton>
            <pre className="text-select">
              {JSON.stringify(cacheData, null, 2)}
            </pre>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </Page>
  );
};
