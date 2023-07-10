import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRef } from "react";

export const AddPlaylistItemsModal = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const modal = useRef<HTMLIonModalElement>(null);

  if (!isOpen) return <></>;

  return (
    <IonModal
      ref={modal}
      isOpen={true}
      presentingElement={document.getElementById("page")!}
      onDidDismiss={() => setOpen(false)}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>プレイリストに追加</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>aaaaa</IonContent>
    </IonModal>
  );
};
