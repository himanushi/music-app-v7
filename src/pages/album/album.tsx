import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export const Album = () => {
  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Album</IonTitle>
          </IonToolbar>
        </IonHeader>
        album
      </IonContent>
    </IonPage>
  );
};
