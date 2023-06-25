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
  IonList,
  IonItemDivider,
  IonItem,
  IonLabel,
  IonNote,
  IonAvatar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";

export const Album = () => {
  const contentElement = useRef<HTMLIonContentElement>();
  const [scrollElement, setScrollElement] = useState<HTMLElement>();

  useEffect(() => {
    (async () => {
      if (contentElement.current) {
        setScrollElement(await contentElement.current.getScrollElement());
      }
    })();
  }, [contentElement]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Album</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentElement as any}>
        <IonGrid class="">
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
        <IonList>
          <IonItemDivider>Album</IonItemDivider>
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

        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "100%" }}
          totalCount={100}
          itemContent={(index) => {
            return (
              <div style={{ height: "44px" }}>
                <IonItem>
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
    </IonPage>
  );
};
