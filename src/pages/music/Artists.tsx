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
import { ArtistObject, ArtistsDocument } from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";

const limit = 50;

export const Artists = () => {
  const { contentRef, scrollElement } = useScrollElement();

  const { items: artists, fetchMore } = useFetchItems<ArtistObject>({
    limit,
    doc: ArtistsDocument,
    variables: {
      conditions: {},
      cursor: { limit, offset: 0 },
      sort: { direction: "ASC", order: "NAME" },
    },
  });

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border">
        <IonToolbar>
          <IonTitle>アーティスト</IonTitle>
          <IonButtons slot="end">
            <IonButton color="main">並び替え</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar placeholder="アーティストで検索"></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "100%" }}
          totalCount={artists.length}
          endReached={() => fetchMore()}
          itemContent={(index) => (
            <IonItem
              button
              detail={false}
              routerLink={`/artists/${artists[index].id}`}
            >
              <IonThumbnail
                slot="start"
                style={{ height: "110px", width: "110px" }}
              >
                <img src={artists[index].artworkM?.url} />
              </IonThumbnail>
              <IonLabel class="ion-text-wrap">{artists[index].name}</IonLabel>
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
