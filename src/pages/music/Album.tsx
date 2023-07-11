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
  IonButtons,
  IonAvatar,
} from "@ionic/react";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useCallback, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  FavoriteButton,
  FooterPadding,
  SkeletonItems,
  SquareImage,
} from "~/components";
import {
  AlbumDocument,
  AlbumObject,
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
        {album ? (
          <IonList>
            <IonItem className="ion-text-wrap text-select" lines="none">
              <IonLabel>{album.name}</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <AlbumSearchButtons album={album as AlbumObject} />
            </IonItem>
            <IonItem className="ion-text-wrap text-select" lines="none">
              <IonNote slot="end">{album.copyright}</IonNote>
            </IonItem>
            <IonItem className="ion-text-wrap text-select">
              <IonNote slot="end">
                {convertDate(album.releaseDate)}, {album.tracks.length}曲,{" "}
                {convertTime(toMs(album.tracks))}
              </IonNote>
            </IonItem>
            {album.status !== "ACTIVE" && (
              <IonItem color={album.status === "PENDING" ? "yellow" : "red"}>
                {album.status}
              </IonItem>
            )}
          </IonList>
        ) : (
          <SkeletonItems count={5} lines="none" />
        )}
        {album ? (
          <AlbumTracks
            tracks={tracks as TrackObject[]}
            scrollElement={scrollElement}
          />
        ) : (
          <SkeletonItems count={10} />
        )}
        {album ? (
          <AlbumArtists albumId={album.id} scrollElement={scrollElement} />
        ) : (
          <SkeletonItems count={5} />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const AlbumSearchButtons = ({ album }: { album: AlbumObject }) => {
  return (
    <IonButtons slot="end">
      <FavoriteButton type="albumIds" id={album?.id} size="s" />
    </IonButtons>
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
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={tracks.length}
        itemContent={(index) => <AlbumTrackItem track={tracks[index]} />}
      />
    </IonList>
  );
};

const AlbumTrackItem = ({ track }: { track: TrackObject }) => {
  const onClick = useCallback(async () => {
    await CapacitorMusicKit.setQueue({ ids: [track.appleMusicId] });
    CapacitorMusicKit.play({});
  }, [track]);

  return (
    <IonItem button detail={false} onClick={onClick}>
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
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
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
