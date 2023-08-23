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
import { useCallback, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  AddPlaylistItemsDocument,
  PlaylistObject,
  PlaylistsDocument,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";
import { NewPlaylistButton, SquareImage } from ".";

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
          <IonButtons slot="start">
            <IonButton onClick={() => onDismiss()} color="main">
              キャンセル
            </IonButton>
          </IonButtons>
          <IonTitle>プレイリストに追加</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Playlists trackIds={trackIds} onDismiss={onDismiss} />
      <IonFooter>
        <IonToolbar />
      </IonFooter>
    </IonPage>
  );
};

const limit = 100;

const Playlists = ({
  trackIds,
  onDismiss,
}: {
  trackIds: string[];
  onDismiss: () => void;
}) => {
  const {
    items: playlists,
    fetchMore,
    refresh,
  } = useFetchItems<PlaylistObject, typeof PlaylistsDocument>({
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
      <div onClick={onDismiss}>
        <NewPlaylistButton trackIds={trackIds} />
      </div>
      <Virtuoso
        key={playlists[0]?.id}
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={playlists.length}
        endReached={() => playlists.length >= limit && fetchMore()}
        itemContent={(index) => (
          <PlaylistItem
            playlist={playlists[index]}
            trackIds={trackIds}
            onDismiss={onDismiss}
          />
        )}
      />
    </IonContent>
  );
};

const PlaylistItem = ({
  playlist,
  trackIds,
  onDismiss,
}: {
  playlist: PlaylistObject;
  trackIds: string[];
  onDismiss: () => void;
}) => {
  const [add] = useMutation(AddPlaylistItemsDocument);
  const [toast] = useIonToast();
  const onClick = useCallback(async () => {
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
        duration: 3000,
        position: "bottom",
        color: "main",
      });
      onDismiss();
    } catch (error: any) {
      toast({
        color: "light-red",
        duration: 5000,
        message: `エラーが発生しました。${error.message}`,
      });
    }
  }, [add, onDismiss, playlist.id, toast, trackIds]);

  return (
    <IonItem button detail={false} key={playlist.id} onClick={onClick}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <SquareImage src={playlist.track?.artworkM.url} />
      </IonThumbnail>
      <IonLabel>{playlist.name}</IonLabel>
    </IonItem>
  );
};
