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
  IonItemDivider,
  IonItem,
  IonLabel,
  IonNote,
  IonButtons,
  IonButton,
  IonAvatar,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import { useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon, SquareImage } from "~/components";
import {
  AlbumObject,
  AlbumsDocument,
  ArtistObject,
  ArtistsDocument,
  TrackDocument,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";
import { convertImageUrl, convertTime, toMs } from "~/lib";

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

  const track = useMemo(() => data?.track, [data?.track]);

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
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
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {track ? <IonLabel>{track.name}</IonLabel> : <IonSkeletonText />}
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {track ? (
              <IonNote slot="end">{convertTime(toMs([track]))}</IonNote>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
          <IonItemDivider sticky>トラック</IonItemDivider>
          <IonItem button detail={false}>
            {track ? (
              <>
                <IonThumbnail slot="start">
                  <img src={track.artworkM?.url} />
                </IonThumbnail>
                <IonLabel class="ion-text-wrap">{track.name}</IonLabel>
                <IonButtons slot="end">
                  <IonButton>
                    <Icon
                      size="s"
                      color="red"
                      slot="icon-only"
                      name="favorite"
                    />
                  </IonButton>
                  <IonButton>
                    <Icon size="m" slot="icon-only" name="more_horiz" />
                  </IonButton>
                </IonButtons>
              </>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
        </IonList>
        {track && (
          <TrackArtists trackId={track.id} scrollElement={scrollElement} />
        )}
        {track && (
          <TrackAlbums trackId={track.id} scrollElement={scrollElement} />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const limit = 50;

const TrackArtists = ({
  trackId,
  scrollElement,
}: {
  trackId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const { items: artists, fetchMore } = useFetchItems<ArtistObject>({
    limit,
    doc: ArtistsDocument,
    variables: {
      conditions: { trackIds: [trackId] },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
  });

  return (
    artists.length > 0 && (
      <IonList>
        <IonItemDivider sticky>アーティスト</IonItemDivider>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "44.5px" }}
          totalCount={artists.length}
          endReached={() => fetchMore()}
          itemContent={(index) => (
            <IonItem button detail={false}>
              <IonAvatar slot="start" style={{ height: "60px", width: "60px" }}>
                <img src={`https://picsum.photos/id/${index + 100}/600`} />
              </IonAvatar>
              <IonLabel>{artists[index].name}</IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
        />
      </IonList>
    )
  );
};

const TrackAlbums = ({
  trackId,
  scrollElement,
}: {
  trackId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const { items: albums, fetchMore } = useFetchItems<AlbumObject>({
    limit,
    doc: AlbumsDocument,
    variables: {
      conditions: { trackIds: [trackId] },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
  });

  return (
    albums.length > 0 && (
      <IonList>
        <IonItemDivider sticky>アルバム</IonItemDivider>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "44.5px" }}
          totalCount={albums.length}
          endReached={() => fetchMore()}
          itemContent={(index) => (
            <IonItem button detail={false}>
              <IonThumbnail
                slot="start"
                style={{ height: "110px", width: "110px" }}
              >
                <img src={albums[index].artworkM?.url} />
              </IonThumbnail>
              <IonLabel>{albums[index].name}</IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
        />
      </IonList>
    )
  );
};
