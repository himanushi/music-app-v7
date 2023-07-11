import { useMutation } from "@apollo/client";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCallback, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  AddPlaylistItemsDocument,
  PlaylistObject,
  PlaylistsDocument,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";

export const AddPlaylistItemsModal = ({
  trackIds,
  isOpen,
  setOpen,
}: {
  trackIds: string[];
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const close = useCallback(() => {
    modal.current?.dismiss();
    setOpen(false);
  }, [setOpen]);

  if (!isOpen) return <></>;

  return (
    <IonModal
      ref={modal}
      isOpen={true}
      presentingElement={document.getElementById("page")!}
      onDidDismiss={() => setOpen(false)}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
      }}
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>プレイリストに追加</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={close} color="main">
              閉じる
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Playlists trackIds={trackIds} />
      <IonFooter>
        <IonToolbar />
      </IonFooter>
    </IonModal>
  );
};

const limit = 100;

const Playlists = ({ trackIds }: { trackIds: string[] }) => {
  const { items: playlists, fetchMore } = useFetchItems<PlaylistObject>({
    limit,
    doc: PlaylistsDocument,
    variables: {
      conditions: { isMine: true },
      cursor: { limit, offset: 0 },
      sort: { order: "UPDATE", direction: "DESC" },
    },
  });

  const { contentRef, scrollElement } = useScrollElement();

  return (
    <IonContent fullscreen ref={contentRef}>
      <Virtuoso
        key={playlists[0]?.id}
        useWindowScroll
        customScrollParent={scrollElement}
        style={{ height: "100%" }}
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
  const onClick = async () => {
    setDisabled(true);
    await add({
      variables: {
        input: {
          playlistId: playlist.id,
          trackIds: trackIds,
        },
      },
    });
    setDisabled(false);
  };

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
