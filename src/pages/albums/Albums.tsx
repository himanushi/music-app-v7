import { useQuery } from "@apollo/client";
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
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon } from "~/components";
import { AlbumsDocument } from "~/graphql/types";
import { useScrollElement } from "~/hooks";

export const Albums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const history = useHistory();

  const [offset, setOffset] = useState(50);
  const { data, loading, fetchMore } = useQuery(AlbumsDocument, {
    variables: {
      conditions: {},
      cursor: { limit: 50, offset: 0 },
      sort: { direction: "DESC", order: "RELEASE" },
    },
    fetchPolicy: "cache-first",
  });

  const albums = data?.items ?? [];

  const fetchItems = useCallback(() => {
    if (loading) return;
    setOffset((prevOffset) => prevOffset + 50);
    fetchMore({
      variables: {
        cursor: { limit: 50, offset: offset },
      },
    });
  }, [fetchMore, offset, loading]);

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
          endReached={() => fetchItems()}
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
                <img src={albums[index].artworkM?.url} />
              </IonThumbnail>
              <IonLabel class="ion-text-wrap">{albums[index].name}</IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
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
