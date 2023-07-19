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
  IonThumbnail,
} from "@ionic/react";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, SkeletonItems, SquareImage } from "~/components";
import { useScrollElement } from "~/hooks";
import { convertImageUrl } from "~/lib";

export const LibraryAlbum: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const [album, setAlbum] = useState<MusicKit.LibraryAlbums>();
  useEffect(() => {
    CapacitorMusicKit.getLibraryAlbums({ ids: [match.params.id] }).then(
      (result) => {
        if (result.data && result.data[0]) {
          setAlbum(result.data[0]);
        }
      }
    );
  }, [match.params.id]);

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <LibraryAlbumInfo album={album} />
        {album ? (
          <>
            <AlbumTracks albumId={album.id} scrollElement={scrollElement} />
            {/* <AlbumArtists albumId={album.id} scrollElement={scrollElement} /> */}
          </>
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
          {/* <IonItem lines="none">
            <AlbumMenuButtons album={album as AlbumObject} />
          </IonItem> */}
          {/* <IonItem className="ion-text-wrap text-select" lines="none">
            <IonNote slot="end">{album}</IonNote>
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
          )} */}
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

// const AlbumMenuButtons = ({ album }: { album: AlbumObject }) => {
//   const { open } = useMenu({
//     component: ({ onDismiss }) => (
//       <IonContent onClick={() => onDismiss()}>
//         <AddPlaylistMenuItem trackIds={album?.tracks.map((t) => t.id) ?? []} />
//         <SpotifyItem name={album.name} />
//       </IonContent>
//     ),
//   });

//   return (
//     <IonButtons slot="end">
//       <FavoriteButton type="albumIds" id={album?.id} size="s" />
//       <IonButton onClick={(event) => open(event)}>
//         <Icon name="more_horiz" slot="icon-only" />
//       </IonButton>
//     </IonButtons>
//   );
// };

const AlbumTracks = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const [tracks, setTracks] = useState<MusicKit.LibrarySongs[]>([]);
  useEffect(() => {
    CapacitorMusicKit.getLibrarySongs({ albumId: albumId, limit: 100 }).then(
      (result) => {
        if (result.data) {
          setTracks(result.data);
        }
      }
    );
  }, [albumId]);

  return (
    <IonList>
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
    <IonItem button detail={false} onClick={onClick}>
      {/* {displayThumbnail ? ( */}
      <IonThumbnail slot="start" style={{ height: "50px", width: "50px" }}>
        <img
          src={convertImageUrl({ url: track.attributes.artwork?.url, px: 50 })}
        />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{track.attributes.name}</IonLabel>
      {/* <TrackItemButtons track={track} /> */}
    </IonItem>
  );
};

// const AlbumArtists = ({
//   albumId,
//   scrollElement,
// }: {
//   albumId: string;
//   scrollElement: HTMLElement | undefined;
// }) => {
//   const limit = 100;
//   const { items: artists } = useFetchItems<
//     ArtistObject,
//     typeof ArtistsDocument
//   >({
//     limit,
//     doc: ArtistsDocument,
//     variables: {
//       conditions: { albumIds: [albumId] },
//       cursor: { limit, offset: 0 },
//       sort: { direction: "DESC", order: "POPULARITY" },
//     },
//   });

//   if (artists.length === 0) return <></>;

//   return (
//     <IonList>
//       <IonItem>
//         <IonNote>アーティスト</IonNote>
//       </IonItem>
//       <Virtuoso
//         useWindowScroll
//         customScrollParent={scrollElement}
//         totalCount={artists.length}
//         itemContent={(index) => <ArtistItem artist={artists[index]} />}
//       />
//     </IonList>
//   );
// };
