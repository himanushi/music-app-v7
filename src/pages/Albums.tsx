import {
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { useScrollElement } from "~/hooks";

export const Albums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Albums</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "100%" }}
          totalCount={50}
          itemContent={(index) => (
            <IonItem button onClick={() => history.push(`/albums/${index}`)}>
              <IonThumbnail slot="start">
                <img src={`https://picsum.photos/id/${index}/300`} />
              </IonThumbnail>
              <IonLabel>{index} アルバム名</IonLabel>
            </IonItem>
          )}
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
