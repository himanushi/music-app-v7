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
import { useCallback, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon } from "~/components";
import { TracksDocument } from "~/graphql/types";
import { useScrollElement } from "~/hooks";

const limit = 50;

export const Tracks = () => {
  const { contentRef, scrollElement } = useScrollElement();

  const [offset, setOffset] = useState(50);

  const { data, fetchMore } = useQuery(TracksDocument, {
    variables: {
      conditions: {},
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
    fetchPolicy: "cache-first",
  });

  const fetchItems = useCallback(
    (offset: number) => {
      setOffset((prevOffset) => prevOffset + limit);
      fetchMore({
        variables: {
          cursor: { limit, offset: offset },
        },
      });
    },
    [fetchMore]
  );

  const tracks = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border">
        <IonToolbar>
          <IonTitle>トラック</IonTitle>
          <IonButtons slot="end">
            <IonButton color="main">並び替え</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar placeholder="トラックで検索"></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "100%" }}
          totalCount={tracks.length}
          endReached={() => fetchItems(offset)}
          itemContent={(index) => (
            <IonItem
              button
              detail={false}
              routerLink={`/tracks/${tracks[index].id}`}
            >
              <IonThumbnail slot="start">
                <img src={tracks[index].artworkM?.url} />
              </IonThumbnail>
              <IonLabel class="ion-text-wrap">{tracks[index].name}</IonLabel>
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
