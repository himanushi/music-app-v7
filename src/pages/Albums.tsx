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
      <IonHeader translucent>
        <IonSearchbar placeholder="アルバムで検索"></IonSearchbar>
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
                style={{ height: "100px", width: "100px" }}
              >
                <img src={`https://picsum.photos/id/${index}/300`} />
              </IonThumbnail>
              <IonLabel>{index} アルバム名</IonLabel>
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
