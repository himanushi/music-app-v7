import {
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
  IonButton,
  IonButtons,
} from "@ionic/react";
import { useEffect, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  AddPlaylistMenuItem,
  Icon,
  Page,
  SkeletonItems,
  SquareImage,
} from "~/components";
import { AppleMusicItem } from "~/components/searchItem/appleMusicItem";
import {
  LibraryAlbumsDocument,
  LibraryArtistsDocument,
  LibraryTracksDocument,
} from "~/graphql/appleMusicClient";
import {
  useFetchLibraryItems,
  useMenu,
  useMusicKit,
  useMusicKitAPI,
  useScrollElement,
} from "~/hooks";
import { convertImageUrl, convertTime, toMs, toTrack } from "~/lib";
import { TrackItem } from "..";

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

  const album: MusicKit.LibraryAlbums = useMemo(() => items[0], [items]);

  return (
    <Page>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent ref={contentRef}>
        <LibraryAlbumInfo libraryAlbum={album} key={album?.id} />
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
      </IonContent>
    </Page>
  );
};

const LibraryAlbumInfo = ({
  libraryAlbum,
}: {
  libraryAlbum?: MusicKit.LibraryAlbums;
}) => {
  const { items } = useMusicKitAPI<MusicKit.Albums>({
    url: `/v1/me/library/albums/${libraryAlbum?.id}/catalog`,
    skip: !libraryAlbum,
  });
  const album = items[0];

  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              key={libraryAlbum?.attributes?.artwork?.url}
              src={convertImageUrl({
                px: 500,
                url: libraryAlbum?.attributes?.artwork?.url,
              })}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {libraryAlbum ? (
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonLabel className="ion-text-wrap text-select">
              {libraryAlbum.attributes.name}
            </IonLabel>
          </IonItem>
          {album && (
            <AppleMusicItem
              isAppleMusic={!!album.attributes.playParams}
              appleMusicId={album.id}
            />
          )}
          <IonItem lines="none">
            <LibraryAlbumMenuButtons album={libraryAlbum} />
          </IonItem>
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const LibraryAlbumMenuButtons = ({
  album,
}: {
  album: MusicKit.LibraryAlbums;
}) => {
  const { open } = useMenu({
    component: ({ onDismiss }) => (
      <IonContent onClick={() => onDismiss()}>
        <AddPlaylistMenuItem trackIds={[]} />
      </IonContent>
    ),
  });

  return (
    <IonButtons slot="end">
      <IonButton onClick={(event) => open(event)}>
        <Icon name="more_horiz" slot="icon-only" />
      </IonButton>
    </IonButtons>
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
  const { items, fetchMore, meta } = useFetchLibraryItems<
    MusicKit.LibrarySongs,
    any
  >({
    doc: LibraryTracksDocument,
    limit,
    variables: { limit, offset: 0, albumId },
    refreshId: `LibraryTracks:{"albumId":"${albumId}"}`,
  });

  useEffect(() => {
    if (meta.total > items.length) fetchMore();
  }, [fetchMore, meta.total, items.length]);

  const tracks = items.map((item) => toTrack(item));

  return (
    <IonList>
      <IonItem className="ion-text-wrap text-select">
        <IonNote slot="end">
          {items.length}曲,{" "}
          {convertTime(toMs(items.map((t) => t.attributes.durationInMillis)))}
        </IonNote>
      </IonItem>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={tracks.length}
        itemContent={(index) => (
          <TrackItem tracks={tracks} track={tracks[index]} index={index} />
        )}
      />
    </IonList>
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
