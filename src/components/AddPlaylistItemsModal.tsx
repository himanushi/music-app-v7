import { useMutation } from "@apollo/client";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  AddPlaylistItemsDocument,
  PlaylistObject,
  PlaylistsDocument,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";

export const AddPlaylistItemsModal = ({
  trackIds,
  onDismiss,
}: {
  trackIds: string[];
  onDismiss: () => void;
}) => {
  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>プレイリストに{trackIds.length}曲追加</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss()} color="main">
              閉じる
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Playlists trackIds={trackIds} />
      <IonFooter>
        <IonToolbar />
      </IonFooter>
    </IonPage>
  );
};

const limit = 100;

const Playlists = ({ trackIds }: { trackIds: string[] }) => {
  const {
    items: playlists,
    fetchMore,
    refresh,
  } = useFetchItems<PlaylistObject>({
    limit,
    doc: PlaylistsDocument,
    variables: {
      conditions: { isMine: true },
      cursor: { limit, offset: 0 },
      sort: { order: "UPDATE", direction: "DESC" },
    },
    refreshName: "playlists",
  });

  // 曲が追加されたら再取得
  useEffect(() => refresh(), [refresh]);

  const { contentRef, scrollElement } = useScrollElement();

  return (
    <IonContent fullscreen ref={contentRef}>
      <Virtuoso
        key={playlists[0]?.id}
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={playlists.length}
        endReached={() => playlists.length >= limit && fetchMore()}
        itemContent={(index) => (
          <PlaylistItem playlist={playlists[index]} trackIds={trackIds} />
        )}
      />
    </IonContent>
  );
};

const PlaylistItem = ({
  playlist,
  trackIds,
}: {
  playlist: PlaylistObject;
  trackIds: string[];
}) => {
  const [add] = useMutation(AddPlaylistItemsDocument);
  const [disabled, setDisabled] = useState(false);
  const [toast] = useIonToast();
  const onClick = useCallback(async () => {
    setDisabled(true);
    try {
      await add({
        variables: {
          input: {
            playlistId: playlist.id,
            trackIds: trackIds,
          },
        },
      });
      toast({
        message: "追加しました",
        duration: 1000,
        position: "bottom",
        color: "main",
      });
    } catch (error: any) {
      toast({
        color: "light-red",
        duration: 5000,
        message: `エラーが発生しました。${error.message}`,
      });
    }
    setDisabled(false);
  }, [add, playlist.id, toast, trackIds]);

  return (
    <IonItem color="dark-gray" key={playlist.id}>
      <IonThumbnail slot="start">
        <img src={playlist.track?.artworkM.url} alt={playlist.name} />
      </IonThumbnail>
      <IonLabel>{playlist.name}</IonLabel>
      <IonButton disabled={disabled} slot="end" color="white" onClick={onClick}>
        追加する
      </IonButton>
    </IonItem>
  );
};
