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
import { useCallback, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, SkeletonItems, SquareImage } from "~/components";
import {
  LibraryAlbumsDocument,
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

  const limit = 1;
  const { isAuthorized } = useMusicKit();
  const { items } = useFetchLibraryItems<MusicKit.LibraryAlbums, any>({
    doc: LibraryAlbumsDocument,
    limit,
    variables: { limit, offset: 0, ids: [match.params.id] },
    skip: !isAuthorized,
  });
  const album = items[0];

  const albumTracks = useMemo(
    () => (
      <AlbumTracks albumId={match.params.id} scrollElement={scrollElement} />
    ),
    [match.params.id, scrollElement]
  );

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <LibraryAlbumInfo album={album} />
        {match.params.id ? albumTracks : <SkeletonItems count={10} />}
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

const AlbumTracks = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 100;
  const { items: tracks, fetchMore } = useFetchLibraryItems<
    MusicKit.LibrarySongs,
    any
  >({
    doc: LibraryTracksDocument,
    limit,
    variables: { limit, offset: 0, albumId },
  });

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
        endReached={() => tracks.length >= limit && fetchMore()}
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
