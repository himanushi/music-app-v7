import {
  IonAvatar,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";

export const Albums = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>aaaa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={100}
          itemContent={(index) => {
            return (
              <div style={{ height: "56px" }}>
                <IonItem onClick={() => history.push(`/albums/${index}`)}>
                  <IonAvatar slot="start">
                    <img src="https://picsum.photos/seed/picsum/40/40" />
                  </IonAvatar>
                  <IonLabel>{index}</IonLabel>
                </IonItem>
              </div>
            );
          }}
        />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>aaaa</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
