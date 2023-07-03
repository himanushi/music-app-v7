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
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon } from "~/components";
import { AlbumsDocument } from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";

const limit = 50;

export const Albums = () => {
  const { contentRef, scrollElement } = useScrollElement();

  const { items: albums, fetchMore } = useFetchItems({
    limit,
    doc: AlbumsDocument,
    variables: {
      conditions: { name: "final" },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "RELEASE" },
    },
  });

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
          endReached={() => fetchMore()}
          itemContent={(index) => (
            <IonItem
              button
              detail={false}
              routerLink={`/albums/${albums[index].id}`}
            >
              <IonThumbnail
                slot="start"
                style={{ height: "110px", width: "110px" }}
              >
                <img src={albums[index].artworkM?.url} />
              </IonThumbnail>
              <IonLabel class="ion-text-wrap">{albums[index].name}</IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
                <IonButton>
                  <Icon size="m" slot="icon-only" name="more_horiz" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};
