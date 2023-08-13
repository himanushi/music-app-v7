import { useMutation, useQuery } from "@apollo/client";
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
  useIonActionSheet,
  useIonToast,
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
  ActionButton,
  ShareButton
} from "~/components";
import {
  AlbumDocument,
  AlbumObject,
  ArtistObject,
  ArtistsDocument,
  ChangeAlbumStatusDocument,
} from "~/graphql/types";
import { useFetchItems, useMe, useMenu, useScrollElement } from "~/hooks";
import {
  convertDate,
  convertImageUrl,
  convertTime,
  toMs,
  toTrack,
} from "~/lib";
import { ArtistItem, TrackItem } from ".";
import { useSearchLibraryAlbum } from "~/hooks";
import { Track, musicPlayerService } from "~/machines/musicPlayerMachine";

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
              fontWeight: "700", textAlign: "center", fontSize: "18px"
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
              {libraryAlbum && (
                <IonCol>
                  <ActionButton routerLink={`/library-albums/${libraryAlbum.id}`} color="red" expand="block">
                    <IonLabel>ライブラリで表示</IonLabel>
                  </ActionButton>
                </IonCol>
              )}
            </IonRow>
            <IonRow>
              <IonCol>
                <ActionButton color="dark-gray" expand="block" onClick={() => musicPlayerService.send({
                  type: "REPLACE_AND_PLAY",
                  tracks: album.tracks.map((t) => toTrack(t)),
                  currentPlaybackNo: 0,
                })}>
                  <Icon name="play_arrow" size="s" slot="icon-only" color="main" />
                  <IonLabel color="main">再生</IonLabel>
                </ActionButton>
              </IonCol>
              <IonCol>
                <ActionButton color="dark-gray" expand="block" onClick={() => musicPlayerService.send({
                  type: "REPLACE_AND_PLAY",
                  tracks: album.tracks.map((t) => toTrack(t)),
                  currentPlaybackNo: 0,
                })}>
                  <Icon name="shuffle" size="s" slot="icon-only" color="main" />
                  <IonLabel color="main">シャッフル</IonLabel>
                </ActionButton>
              </IonCol>
            </IonRow>
          </IonGrid>
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
        <AddPlaylistMenuItem trackIds={album.tracks.map((t) => t.id) ?? []} />
        <SpotifyItem name={album.name} />
        <AlbumChangeStatusItem album={album} />
      </IonContent>
    ),
  });

  return (
    <>
      <IonButtons slot="start">
        <ShareButton
          path={`/albums/${album.id}`}
          text={`「${album.name}」`}
          hashtags={[
            "ゲーム音楽",
            album.appleMusicPlayable ? "AppleMusic" : "iTunes",
          ]}
        />
      </IonButtons>
      <IonButtons slot="end">
        <FavoriteButton type="albumIds" id={album?.id} size="s" />
        <IonButton onClick={(event) => open(event)}>
          <Icon name="more_horiz" slot="icon-only" />
        </IonButton>
      </IonButtons>
    </>
  );
};

const AlbumChangeStatusItem = ({ album }: { album: AlbumObject }) => {
  const { isAllowed } = useMe();
  const [open] = useIonActionSheet();
  const [change] = useMutation(ChangeAlbumStatusDocument, {
    refetchQueries: [AlbumDocument],
  });
  const [toast] = useIonToast();

  if (!isAllowed("changeAlbumStatus")) return <></>;

  return <IonItem color="dark-gray" onClick={() => open({
    header: 'Change Status',
    buttons: [{
      text: '有効',
      data: {
        action: 'ACTIVE',
      },
    },
    {
      text: '保留',
      data: {
        action: 'PENDING',
      },
    },
    {
      text: '除外',
      data: {
        action: 'IGNORE',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'CANCEL',
      },
    }],
    onDidDismiss: async ({ detail }) => {
      if (detail.data.action === 'CANCEL') return;
      await change({
        variables: {
          input: {
            id: album.id,
            status: detail.data.action,
            tweet: false
          }
        },
      })
      await toast({
        message: 'ステータスを変更しました',
        duration: 3000,
      })
    }
  })}>
    ステータス変更
  </IonItem >
}

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
  const { isAllowed } = useMe();
  const limit = 100;
  const { items: artists } = useFetchItems<
    ArtistObject,
    typeof ArtistsDocument
  >({
    limit,
    doc: ArtistsDocument,
    variables: {
      conditions: {
        albumIds: [albumId],
        status: isAllowed("changeArtistStatus") ? ["ACTIVE", "IGNORE", "PENDING"] : ["ACTIVE"]
      },
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
