import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonSearchbar,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { Footer, Icon } from "~/components";
import { useScrollElement } from "~/hooks";

export const Albums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border">
        <IonToolbar>
          <IonTitle>アルバム</IonTitle>
          <IonButtons slot="end">
            <IonButton color="main">並び替え</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar placeholder="アルバムで検索"></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "100%" }}
          totalCount={50}
          itemContent={(index) => (
            <IonItem
              button
              detail={false}
              onClick={() => history.push(`/albums/${index}`)}
            >
              <IonThumbnail
                slot="start"
                style={{ height: "110px", width: "110px" }}
              >
                <img src={`https://picsum.photos/id/${index}/300`} />
              </IonThumbnail>
              <IonLabel class="ion-text-wrap">
                {index}
                アルバム名アルバム名アルバム名アルバム名
              </IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};
