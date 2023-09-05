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
  IonTitle,
  IonThumbnail,
} from "@ionic/react";
import { useCallback, useEffect, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  Icon,
  Page,
  SkeletonItems,
  SquareImage,
  AppleMusicViewButton,
  SwitchTitle,
  ActionButton,
} from "~/components";
import {
  LibraryAlbumsDocument,
  LibraryArtistsDocument,
  LibraryTracksDocument,
} from "~/graphql/appleMusicClient";
import {
  useFetchLibraryItems,
  useMusicKit,
  useMusicKitAPI,
  useScrollElement,
  useStartedServiceState,
} from "~/hooks";
import { convertImageUrl, convertTime, toMs, toTrack } from "~/lib";
import { Track, musicPlayerService } from "~/machines/musicPlayerMachine";

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
      <IonHeader translucent>
        <IonToolbar>
          {album && (
            <>
              <IonTitle>{album.attributes.name}</IonTitle>
            </>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
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
              maxWidth="300px"
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {libraryAlbum ? (
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonLabel
              className="ion-text-wrap"
              style={{
                fontWeight: "700",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              {libraryAlbum.attributes.name}
            </IonLabel>
          </IonItem>
          <SwitchTitle />
          {album ? (
            <IonGrid fixed>
              <IonRow>
                <IonCol>
                  <AppleMusicViewButton
                    isAppleMusic={!!album.attributes.playParams}
                    appleMusicId={album.id}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          ) : (
            <></>
          )}
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
      <IonGrid fixed>
        <IonRow>
          <IonCol>
            <ActionButton
              color="dark-gray"
              expand="block"
              onClick={() =>
                musicPlayerService.send({
                  type: "REPLACE_AND_PLAY",
                  tracks,
                  currentPlaybackNo: 0,
                })
              }
            >
              <Icon name="play_arrow" size="s" slot="icon-only" color="red" />
              <IonLabel color="red">再生</IonLabel>
            </ActionButton>
          </IonCol>
          <IonCol>
            <ActionButton
              color="dark-gray"
              expand="block"
              onClick={() =>
                musicPlayerService.send({
                  type: "REPLACE_AND_PLAY",
                  tracks,
                  currentPlaybackNo: 0,
                })
              }
            >
              <Icon name="shuffle" size="s" slot="icon-only" color="red" />
              <IonLabel color="red">シャッフル</IonLabel>
            </ActionButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={tracks.length}
        itemContent={(index) => (
          <LibraryTrackItem
            tracks={tracks}
            track={tracks[index]}
            index={index}
          />
        )}
      />
      <IonItem className="ion-text-wrap text-select">
        <IonNote style={{ fontSize: "14px" }}>
          {items.length}曲,{" "}
          {convertTime(toMs(items.map((t) => t.attributes.durationInMillis)))}
        </IonNote>
      </IonItem>
    </IonList>
  );
};

export const LibraryTrackItem = ({
  index,
  track,
  tracks,
  displayThumbnail = false,
}: {
  index: number;
  track: Track;
  tracks: Track[];
  displayThumbnail?: boolean;
  reorder?: boolean;
}) => {
  useStartedServiceState(musicPlayerService);

  const onClick = useCallback(async () => {
    musicPlayerService.send({
      type: "REPLACE_AND_PLAY",
      tracks,
      currentPlaybackNo: index,
    });
  }, [tracks, index]);

  const playing =
    musicPlayerService.getSnapshot().context.currentTrack?.appleMusicId ===
    track.appleMusicId;

  return (
    <IonItem
      button
      detail={false}
      onClick={onClick}
      color={playing ? "main" : ""}
    >
      {displayThumbnail ? (
        <IonThumbnail slot="start" style={{ height: "50px", width: "50px" }}>
          <SquareImage
            key={track.artworkUrl}
            src={convertImageUrl({ url: track.artworkUrl, px: 50 })}
          />
        </IonThumbnail>
      ) : (
        <IonNote slot="start">{track.trackNumber}</IonNote>
      )}
      <IonLabel class="ion-text-wrap">{track.name}</IonLabel>
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
