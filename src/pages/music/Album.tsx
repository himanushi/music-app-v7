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
  IonAvatar,
  IonSkeletonText,
} from "@ionic/react";
import { useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, FooterPadding, SquareImage } from "~/components";
import {
  AlbumDocument,
  ArtistObject,
  ArtistsDocument,
  TrackObject,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";
import { convertDate, convertImageUrl, convertTime, toMs } from "~/lib";

export const Album: React.FC<
  RouteComponentProps<{
    albumId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(AlbumDocument, {
    variables: { id: match.params.albumId },
    fetchPolicy: "cache-first",
  });

  const album = useMemo(() => data?.album, [data?.album]);
  const tracks = useMemo(() => album?.tracks ?? [], [album?.tracks]);

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
                  url: album?.artworkL?.url,
                })}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {album ? <IonLabel>{album.name}</IonLabel> : <IonSkeletonText />}
          </IonItem>
          <IonItem button detail={false} lines="none">
            {album ? (
              <IonButtons slot="end">
                <FavoriteButton type="albumIds" id={album?.id} size="s" />
              </IonButtons>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {album ? (
              <IonNote slot="end">{album?.copyright}</IonNote>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {album ? (
              <IonNote slot="end">
                {convertDate(album.releaseDate)}, {album.tracks.length}曲,{" "}
                {convertTime(toMs(album.tracks))}
              </IonNote>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
        </IonList>
        {album ? (
          <AlbumTracks
            tracks={tracks as TrackObject[]}
            scrollElement={scrollElement}
          />
        ) : (
          <IonList>
            {[...Array(10)].map((_, i) => (
              <IonItem button detail={false} key={i}>
                <IonSkeletonText />
              </IonItem>
            ))}
          </IonList>
        )}
        {album ? (
          <AlbumArtists albumId={album.id} scrollElement={scrollElement} />
        ) : (
          <IonList>
            <IonItemDivider sticky>アーティスト</IonItemDivider>
            {[...Array(5)].map((_, i) => (
              <IonItem button detail={false} key={i}>
                <IonSkeletonText />
              </IonItem>
            ))}
          </IonList>
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const AlbumTracks = ({
  tracks,
  scrollElement,
}: {
  tracks: TrackObject[];
  scrollElement: HTMLElement | undefined;
}) => {
  return (
    <IonList>
      <IonItem />
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        style={{ height: "44.5px" }}
        totalCount={tracks.length}
        itemContent={(index) => <AlbumTrackItem track={tracks[index]} />}
      />
    </IonList>
  );
};

const AlbumTrackItem = ({ track }: { track: TrackObject }) => {
  return (
    <IonItem button detail={false}>
      <IonNote slot="start">{track.trackNumber}</IonNote>
      <IonLabel class="ion-text-wrap">{track.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="trackIds" id={track.id} size="s" />
      </IonButtons>
    </IonItem>
  );
};

const limit = 50;

const AlbumArtists = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const { items: artists, fetchMore } = useFetchItems<ArtistObject>({
    limit,
    doc: ArtistsDocument,
    variables: {
      conditions: { albumIds: [albumId] },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
  });

  return (
    <IonList>
      <IonItem />
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
              <FavoriteButton
                type="artistIds"
                id={artists[index].id}
                size="s"
              />
            </IonButtons>
          </IonItem>
        )}
      />
    </IonList>
  );
};
