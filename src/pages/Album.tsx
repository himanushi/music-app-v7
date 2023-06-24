import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonImg,
  IonCol,
  IonGrid,
  IonRow,
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
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonImg
                style={{
                  maxWidth: "400px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src="https://picsum.photos/seed/picsum/600/600"
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
