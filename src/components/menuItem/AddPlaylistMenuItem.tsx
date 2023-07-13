import { IonItem, IonLabel } from "@ionic/react";
import { useAddPlaylistItems } from "~/hooks";

export const AddPlaylistMenuItem = ({ trackIds }: { trackIds: string[] }) => {
  const { open } = useAddPlaylistItems({ trackIds });
  return (
    <IonItem color="dark" button detail={false} onClick={() => open()}>
      <IonLabel>プレイリストに追加</IonLabel>
    </IonItem>
  );
};
