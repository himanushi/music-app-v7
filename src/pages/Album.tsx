import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
  IonList,
  IonItemDivider,
  IonItem,
  IonLabel,
  IonNote,
} from "@ionic/react";
import { Virtuoso } from "react-virtuoso";
import { SquareImage } from "~/components";
import { useScrollElement } from "~/hooks";

export const Album = () => {
  const { contentRef, scrollElement } = useScrollElement();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Album</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <SquareImage src="https://picsum.photos/seed/picsum/600/600" />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItemDivider sticky>Album</IonItemDivider>
          <IonItem className="ion-text-wrap">
            タイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </IonItem>
          <IonItem className="ion-text-wrap">会社名</IonItem>
          <IonItem>
            <IonLabel>配信日</IonLabel>
            <IonNote>2023年6月23日</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>曲数</IonLabel>
            <IonNote>100曲</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>再生時間</IonLabel>
            <IonNote>1時間</IonNote>
          </IonItem>
        </IonList>
        <IonList>
          <IonItemDivider sticky>Tracks</IonItemDivider>
          <Virtuoso
            useWindowScroll
            customScrollParent={scrollElement}
            style={{ height: "100%" }}
            totalCount={50}
            itemContent={(index) => {
              return (
                <IonItem style={{ height: "45px" }}>
                  <IonNote slot="start">{index + 1}</IonNote>
                  <IonLabel>
                    {index + 1}
                    タイトル
                  </IonLabel>
                </IonItem>
              );
            }}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};
