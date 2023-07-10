import { useQuery } from "@apollo/client";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCallback, useRef } from "react";
import { PlaylistsDocument } from "~/graphql/types";
import { ClickEvent } from "~/types";

export const AddPlaylistItemsModal = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data } = useQuery(PlaylistsDocument, {
    variables: {
      conditions: { isMine: true },
      cursor: { limit: 50, offset: 0 },
      sort: { order: "UPDATE", direction: "DESC" },
    },
    fetchPolicy: "cache-and-network",
    skip: !isOpen,
  });
  const modal = useRef<HTMLIonModalElement>(null);
  const close = useCallback(() => {
    modal.current?.dismiss();
    setOpen(false);
  }, [setOpen]);

  if (!isOpen) return <></>;

  const playlists = data?.items || [];

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
        <IonToolbar>aaa</IonToolbar>
      </IonHeader>
      <IonContent>
        {playlists.map((playlist) => (
          <IonItem color="dark-gray" key={playlist.id}>
            {playlist.name}
          </IonItem>
        ))}
      </IonContent>
    </IonModal>
  );
};
