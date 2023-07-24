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
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useCallback, useEffect, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, SkeletonItems, SquareImage } from "~/components";
import {
  LibraryAlbumsDocument,
  LibraryArtistsDocument,
  LibraryTracksDocument,
} from "~/graphql/appleMusicClient";
import { useFetchLibraryItems, useMusicKit, useScrollElement } from "~/hooks";
import { convertImageUrl, convertTime, toMs } from "~/lib";

export const LibraryAlbum: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const albumLimit = 1;
  const { isAuthorized } = useMusicKit();
  const { items } = useFetchLibraryItems<MusicKit.LibraryAlbums, any>({
    doc: LibraryAlbumsDocument,
    limit: albumLimit,
    variables: { limit: albumLimit, offset: 0, ids: [match.params.id] },
    skip: !isAuthorized,
    refreshId: `LibraryAlbums:{"ids":["${match.params.id}"]}`,
    fetchPolicy: "network-only",
  });

  const album = useMemo(() => items[0], [items]);

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent ref={contentRef}>
        <LibraryAlbumInfo album={album} />
        {match.params.id ? (
          <LibraryAlbumTracks
            albumId={match.params.id}
            scrollElement={scrollElement}
          />
        ) : (
          <SkeletonItems count={10} />
        )}
        {match.params.id ? (
          <LibraryAlbumArtists
            albumId={match.params.id}
            scrollElement={scrollElement}
          />
        ) : (
          <SkeletonItems count={10} />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const LibraryAlbumInfo = ({ album }: { album?: MusicKit.LibraryAlbums }) => {
  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              src={convertImageUrl({
                px: 500,
                url: album?.attributes?.artwork?.url,
              })}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {album ? (
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonLabel className="ion-text-wrap text-select">
              {album.attributes.name}
            </IonLabel>
          </IonItem>
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const LibraryAlbumTracks = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 100;
  const {
    items: tracks,
    fetchMore,
    meta,
  } = useFetchLibraryItems<MusicKit.LibrarySongs, any>({
    doc: LibraryTracksDocument,
    limit,
    variables: { limit, offset: 0, albumId },
    refreshId: `LibraryTracks:{"albumId":"${albumId}"}`,
  });

  useEffect(() => {
    if (meta.total > tracks.length) fetchMore();
  }, [meta.total, tracks.length, fetchMore]);

  return (
    <IonList>
      <IonItem className="ion-text-wrap text-select">
        <IonNote slot="end">
          {tracks.length}曲,{" "}
          {convertTime(toMs(tracks.map((t) => t.attributes.durationInMillis)))}
        </IonNote>
      </IonItem>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={tracks.length}
        itemContent={(index) => (
          <LibraryTrackItem tracks={tracks} track={tracks[index]} />
        )}
      />
    </IonList>
  );
};

export const LibraryTrackItem = ({
  tracks,
  track,
}: {
  tracks: MusicKit.LibrarySongs[];
  track: MusicKit.LibrarySongs;
  displayThumbnail?: boolean;
}) => {
  const onClick = useCallback(async () => {
    await CapacitorMusicKit.setQueue({ ids: tracks.map((t) => t.id) });
    CapacitorMusicKit.play({
      index: tracks.findIndex((t) => t.id === track.id),
    });
  }, [track.id, tracks]);

  return (
    <IonItem
      button
      detail={false}
      disabled={!track.attributes.playParams?.id}
      onClick={onClick}
    >
      <IonNote slot="start">{track.attributes.trackNumber}</IonNote>
      <IonLabel class="ion-text-wrap">{track.attributes.name}</IonLabel>
    </IonItem>
  );
};

const LibraryAlbumArtists = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 10;
  const { items, fetchMore } = useFetchLibraryItems<
    MusicKit.LibraryArtists,
    any
  >({
    doc: LibraryArtistsDocument,
    limit,
    variables: { limit, offset: 0, albumId },
  });

  if (items.length === 0) return <></>;

  return (
    <IonList>
      <IonItem>
        <IonNote>ライブラリアーティスト</IonNote>
      </IonItem>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={items.length}
        endReached={() => items.length >= limit && fetchMore()}
        itemContent={(index) => <LibraryArtistItem artist={items[index]} />}
      />
    </IonList>
  );
};

export const LibraryArtistItem = ({
  artist,
}: {
  artist: MusicKit.LibraryArtists;
  displayThumbnail?: boolean;
}) => {
  return (
    <IonItem button detail={false}>
      <IonLabel class="ion-text-wrap">{artist.attributes.name}</IonLabel>
    </IonItem>
  );
};
