import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonPage,
  IonSearchbar,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon } from "~/components";
import { useScrollElement } from "~/hooks";

export const Albums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const history = useHistory();

  const [albums, setAlbums] = useState<{ name: string }[]>(
    [...Array(50)].map((_, i) => ({ name: `${i}` }))
  );
  const generateItems = useCallback(() => {
    const newItems = [];
    for (let i = 0; i < 50; i++) {
      newItems.push({ name: `${1 + albums.length + i}` });
    }
    setAlbums([...albums, ...newItems]);
  }, [albums]);

  const Footer = useCallback(
    () => (
      <IonInfiniteScroll
        onIonInfinite={(ev) => {
          setTimeout(() => {
            generateItems();
            ev.target.complete();
          }, 1000);
        }}
      >
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    ),
    [generateItems]
  );

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
          totalCount={albums.length}
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
              <IonLabel class="ion-text-wrap">{albums[index].name}</IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
          components={{ Footer }}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};
