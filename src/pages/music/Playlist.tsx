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
  IonButtons,
  IonButton,
  IonNote,
  IonTitle,
  useIonActionSheet,
  useIonToast,
  useIonRouter,
  IonPopover,
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
} from "~/components";
import {
  DeletePlaylistDocument,
  PlaylistDocument,
  PlaylistObject,
  PlaylistsDocument,
} from "~/graphql/types";
import { useMenu, useScrollElement } from "~/hooks";
import {
  convertDate,
  convertImageUrl,
  convertTime,
  toMs,
  toTrack,
} from "~/lib";
import { TrackItem } from ".";
import { Track } from "~/machines/musicPlayerMachine";
import { useCallback, useState } from "react";

export const Playlist: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(PlaylistDocument, {
    variables: { id: match.params.id },
    fetchPolicy: "cache-first",
  });

  const playlist = data?.playlist as PlaylistObject | undefined;
  const tracks: Track[] = (playlist?.items ?? []).map((item) =>
    toTrack(item.track)
  );

  return (
    <Page>
      <IonHeader translucent>
        <IonToolbar>
          {playlist && (
            <>
              <IonTitle>{playlist.name}</IonTitle>
              <MenuButtons playlist={playlist} />
            </>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <PlaylistInfo playlist={playlist as PlaylistObject} />
        {playlist && (
          <PlaylistTracks tracks={tracks} scrollElement={scrollElement} />
        )}
      </IonContent>
    </Page>
  );
};

const PlaylistInfo = ({ playlist }: { playlist?: PlaylistObject }) => {
  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              key={playlist?.track?.artworkL?.url}
              src={convertImageUrl({
                px: 300,
                url: playlist?.track?.artworkL?.url,
              })}
              maxWidth="300px"
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {playlist ? (
        <IonList>
          <IonItem className="text-select" lines="none">
            <IonLabel
              className="ion-text-wrap"
              style={{
                fontWeight: "700",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              {playlist.name}
            </IonLabel>
          </IonItem>
          <SwitchTitle />
          <IonItem className="text-select" lines="none">
            <IonLabel className="ion-text-wrap">
              {playlist.description}
            </IonLabel>
          </IonItem>
          <IonItem className="text-select">
            <IonNote slot="end" style={{ fontSize: "14px", textAlign: "end" }}>
              {playlist.author && (
                <>
                  {playlist.author.name}(@{playlist.author.username})
                </>
              )}
              <br />
              {playlist.items.length}曲,{" "}
              {convertTime(toMs(playlist.items.map((i) => i.track.durationMs)))}
              <br />
              {convertDate(playlist.createdAt)}作成,
              {convertDate(playlist.updatedAt)}更新
            </IonNote>
          </IonItem>
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const MenuButtons = ({ playlist }: { playlist: PlaylistObject }) => {
  const id = `playlist-menu-${playlist.id}`;

  return (
    <IonButtons slot="end">
      <FavoriteButton type="playlistIds" id={playlist.id} size="s" />
      <IonButton id={id}>
        <Icon name="more_horiz" slot="icon-only" />
      </IonButton>
      <IonPopover trigger={id} dismissOnSelect>
        {playlist.isMine && (
          <>
            <IonItem
              color="dark"
              button
              detail={false}
              routerLink={`/playlists/${playlist.id}/edit`}
            >
              編集
              <Icon name="edit" slot="end" size="s" />
            </IonItem>
            <DeleteButton playlist={playlist} />
          </>
        )}
        <AddPlaylistMenuItem
          trackIds={playlist?.items?.map((i) => i.track.id) ?? []}
        />
        <SpotifyItem name={playlist.name} />
      </IonPopover>
    </IonButtons>
  );
};

const DeleteButton = ({ playlist }: { playlist: PlaylistObject }) => {
  const router = useIonRouter();
  const [open] = useIonActionSheet();
  const [toast] = useIonToast();
  const [remove] = useMutation(DeletePlaylistDocument, {
    refetchQueries: [PlaylistsDocument],
  });

  const onClick = useCallback(() => {
    open({
      header: "プレイリストを削除しますか？",
      buttons: [
        {
          text: "削除",
          role: "destructive",
          handler: async () => {
            await remove({
              variables: {
                input: {
                  playlistId: playlist.id,
                },
              },
            });
            router.goBack();
            toast({
              message: "プレイリストを削除しました",
              duration: 2000,
              color: "success",
            });
          },
        },
        {
          text: "キャンセル",
          role: "cancel",
        },
      ],
    });
  }, [open, playlist.id, remove, router, toast]);

  return (
    <IonItem color="dark" button detail={false} onClick={onClick}>
      <IonLabel color="red">削除</IonLabel>
      <Icon name="delete" slot="end" size="s" color="red" />
    </IonItem>
  );
};

const PlaylistTracks = ({
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
          <TrackItem
            index={index}
            tracks={tracks}
            track={tracks[index]}
            displayThumbnail
          />
        )}
      />
    </IonList>
  );
};

export const EditPlaylist: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(PlaylistDocument, {
    variables: { id: match.params.id },
    fetchPolicy: "cache-first",
  });

  const playlist = data?.playlist;
  const tracks: Track[] = (playlist?.items ?? []).map((item) =>
    toTrack(item.track)
  );

  if (playlist && !playlist.isMine) return <></>;

  return (
    <Page>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        {/* <PlaylistInfo playlist={playlist as PlaylistObject} />
        {playlist && (
          <PlaylistTracks tracks={tracks} scrollElement={scrollElement} />
        )} */}
      </IonContent>
    </Page>
  );
};
