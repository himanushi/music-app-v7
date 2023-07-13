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
import { TrackObject, TracksDocument } from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";

const limit = 50;

export const Tracks = () => {
  const { contentRef, scrollElement } = useScrollElement();

  const { items: tracks, fetchMore } = useFetchItems<TrackObject>({
    limit,
    doc: TracksDocument,
    variables: {
      conditions: {},
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
  });

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
          totalCount={tracks.length}
          endReached={() => fetchMore()}
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
