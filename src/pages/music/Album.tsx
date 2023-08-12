import { useQuery } from "@apollo/client";
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
  IonButtons,
  IonButton,
  IonTitle,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  AddPlaylistMenuItem,
  FavoriteButton,
  Icon,
  Page,
  SkeletonItems,
  SpotifyItem,
  SquareImage,
  SwitchTitle,
  AppleMusicPlayButton,
  ActionButton
} from "~/components";
import {
  AlbumDocument,
  AlbumObject,
  ArtistObject,
  ArtistsDocument,
} from "~/graphql/types";
import { useFetchItems, useMenu, useScrollElement } from "~/hooks";
import {
  convertDate,
  convertImageUrl,
  convertTime,
  toMs,
  toTrack,
} from "~/lib";
import { ArtistItem, TrackItem } from ".";
import { useSearchLibraryAlbum } from "~/hooks";
import { Track } from "~/machines/musicPlayerMachine";

export const Album: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(AlbumDocument, {
    variables: { id: match.params.id },
    fetchPolicy: "cache-first",
  });

  const album = data?.album as AlbumObject | undefined;
  const tracks: Track[] = (album?.tracks ?? []).map((track) => toTrack(track));

  return (
    <Page>
      <IonHeader translucent>
        <IonToolbar>
          {
            album && (<>
              <IonTitle>{album.name}</IonTitle>
              <AlbumMenuButtons album={album} />
            </>)
          }
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <AlbumInfo album={album} />
        {album ? (
          <>
            <AlbumTracks tracks={tracks} scrollElement={scrollElement} />
            <IonItem className="text-select" lines="none">
              <IonNote style={{ fontSize: "14px" }}>
                {convertDate(album.releaseDate)}, {album.tracks.length}曲,{" "}
                {convertTime(toMs(album.tracks.map((t) => t.durationMs)))}<br />
                {album.copyright}
              </IonNote>
            </IonItem>
            <AlbumArtists albumId={album.id} scrollElement={scrollElement} />
          </>
        ) : (
          <SkeletonItems count={10} />
        )}
      </IonContent>
    </Page>
  );
};

const AlbumInfo = ({ album }: { album?: AlbumObject }) => {
  const { libraryAlbum } = useSearchLibraryAlbum({
    catalogAlbumName: album?.name,
    catalogAlbumId: album?.appleMusicId,
  });

  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              key={album?.artworkL?.url}
              src={convertImageUrl({
                px: 300,
                url: album?.artworkL?.url,
              })}
              maxWidth="300px"
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {album ? (
        <IonList>
          <IonItem className="text-select" lines="none">
            <IonLabel className="ion-text-wrap" style={{
              fontWeight: "700", textAlign: "center", fontSize: "16px"
            }}>{album.name}</IonLabel>
          </IonItem>
          <SwitchTitle />
          <IonGrid fixed>
            <IonRow>
              <IonCol>
                <AppleMusicPlayButton
                  isAppleMusic={album.appleMusicPlayable}
                  appleMusicId={album.appleMusicId}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <ActionButton color="dark-gray" expand="block">
                  <Icon name="play_arrow" size="s" slot="icon-only" color="red" />
                  <IonLabel color="red">再生</IonLabel>
                </ActionButton>
              </IonCol>
              <IonCol>
                <ActionButton color="dark-gray" expand="block">
                  <Icon name="shuffle" size="s" slot="icon-only" color="red" />
                  <IonLabel color="red">シャッフル</IonLabel>
                </ActionButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          {libraryAlbum && (
            <IonItem
              routerLink={`/library-albums/${libraryAlbum.id}`}
              lines="none"
              key={album.id}
            >
              <Icon name="art_track" size="s" slot="start" color="red" />
              <IonLabel>ライブラリで聴く</IonLabel>
            </IonItem>
          )}
          {album.status !== "ACTIVE" && (
            <IonItem color={album.status === "PENDING" ? "yellow" : "red"}>
              {album.status}
            </IonItem>
          )}
          <IonItem className="text-select" style={{ height: "0px" }} />
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const AlbumMenuButtons = ({ album }: { album: AlbumObject }) => {
  const { open } = useMenu({
    component: ({ onDismiss }) => (
      <IonContent onClick={() => onDismiss()}>
        <AddPlaylistMenuItem trackIds={album?.tracks.map((t) => t.id) ?? []} />
        <SpotifyItem name={album.name} />
      </IonContent>
    ),
  });

  return (
    <IonButtons slot="end">
      <FavoriteButton type="albumIds" id={album?.id} size="s" />
      <IonButton onClick={(event) => open(event)}>
        <Icon name="more_horiz" slot="icon-only" />
      </IonButton>
    </IonButtons>
  );
};

const AlbumTracks = ({
  tracks,
  scrollElement,
}: {
  tracks: Track[];
  scrollElement: HTMLElement | undefined;
}) => {
  return (
    <IonList>
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

const AlbumArtists = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 100;
  const { items: artists } = useFetchItems<
    ArtistObject,
    typeof ArtistsDocument
  >({
    limit,
    doc: ArtistsDocument,
    variables: {
      conditions: { albumIds: [albumId] },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
  });

  if (artists.length === 0) return <></>;

  return (
    <IonList>
      <IonItem>
        <IonNote>アーティスト</IonNote>
      </IonItem>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={artists.length}
        itemContent={(index) => <ArtistItem artist={artists[index]} />}
      />
    </IonList>
  );
};
