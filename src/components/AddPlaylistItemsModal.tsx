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
import { useCallback, useRef } from "react";
import { PlaylistObject, PlaylistsDocument } from "~/graphql/types";
import { useFetchItems } from "~/hooks";

const limit = 100;

export const AddPlaylistItemsModal = ({
  isOpen,
  setOpen,
}: {
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>プレイリストに追加</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={close} color="main">
              閉じる
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Playlists />
      <IonFooter>
        <IonToolbar />
      </IonFooter>
    </IonModal>
  );
};

const Playlists = () => {
  const { items: playlists } = useFetchItems<PlaylistObject>({
    limit,
    doc: PlaylistsDocument,
    variables: {
      conditions: { isMine: true },
      cursor: { limit, offset: 0 },
      sort: { order: "UPDATE", direction: "DESC" },
    },
  });

  return (
    <IonContent fullscreen>
      {playlists.map((playlist) => (
        <PlaylistItem playlist={playlist} />
      ))}
    </IonContent>
  );
};

const PlaylistItem = ({ playlist }: { playlist: PlaylistObject }) => {
  return (
    <IonItem color="dark-gray" key={playlist.id}>
      <IonThumbnail slot="start">
        <img src={playlist.track?.artworkM.url} alt={playlist.name} />
      </IonThumbnail>
      <IonLabel>{playlist.name}</IonLabel>
      <IonButton
        slot="end"
        color="white"
        onClick={() => {
          // nothing
        }}
      >
        追加する
      </IonButton>
    </IonItem>
  );
};
