import { useQuery } from "@apollo/client";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, SkeletonItems, SquareImage } from "~/components";
import {
  AlbumObject,
  AlbumsDocument,
  ArtistObject,
  ArtistsDocument,
  TrackDocument,
  TrackObject,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";
import { convertImageUrl, convertTime, toMs } from "~/lib";
import { AlbumItem, ArtistItem, TrackItem } from ".";

export const Track: React.FC<
  RouteComponentProps<{
    trackId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(TrackDocument, {
    variables: { id: match.params.trackId },
    fetchPolicy: "cache-first",
  });

  const track = data?.track;

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <TrackInfo track={track as TrackObject} />
        {track ? (
          <>
            <TrackAlbums trackId={track.id} scrollElement={scrollElement} />
            <TrackArtists trackId={track.id} scrollElement={scrollElement} />
          </>
        ) : (
          <SkeletonItems count={10} />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const TrackInfo = ({ track }: { track?: TrackObject }) => {
  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              src={convertImageUrl({
                px: 300,
                url: track?.artworkL?.url,
              })}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {track ? (
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonLabel>{track.name}</IonLabel>
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonNote slot="end">{track.isrc}</IonNote>
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonNote slot="end">{convertTime(toMs([track]))}</IonNote>
          </IonItem>
          <TrackItem track={track} displayThumbnail />
          {track.status !== "ACTIVE" && (
            <IonItem color={track.status === "PENDING" ? "yellow" : "red"}>
              {track.status}
            </IonItem>
          )}
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const TrackAlbums = ({
  trackId,
  scrollElement,
}: {
  trackId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 50;
  const { items, fetchMore } = useFetchItems<
    AlbumObject,
    typeof AlbumsDocument
  >({
    limit,
    doc: AlbumsDocument,
    variables: {
      conditions: { trackIds: [trackId] },
      cursor: { limit, offset: 0 },
      sort: { order: "RELEASE", direction: "DESC" },
    },
  });

  if (items.length === 0) return <></>;

  return (
    <IonList>
      <IonItem>
        <IonNote>アルバム</IonNote>
      </IonItem>
      <Virtuoso
        key={items.length}
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={items.length}
        endReached={() => items.length >= limit && fetchMore()}
        itemContent={(index) => <AlbumItem album={items[index]} />}
      />
    </IonList>
  );
};

const TrackArtists = ({
  trackId,
  scrollElement,
}: {
  trackId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 50;
  const { items, fetchMore } = useFetchItems<
    ArtistObject,
    typeof ArtistsDocument
  >({
    limit,
    doc: ArtistsDocument,
    variables: {
      conditions: { trackIds: [trackId] },
      cursor: { limit, offset: 0 },
      sort: { order: "POPULARITY", direction: "DESC" },
    },
  });

  if (items.length === 0) return <></>;

  return (
    <IonList>
      <IonItem>
        <IonNote>アーティスト</IonNote>
      </IonItem>
      <Virtuoso
        key={items.length}
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={items.length}
        endReached={() => items.length >= limit && fetchMore()}
        itemContent={(index) => <ArtistItem artist={items[index]} />}
      />
    </IonList>
  );
};
