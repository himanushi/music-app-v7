import { useIonModal } from "@ionic/react";
import { NewPlaylistModal } from "~/components";

export const useNewPlaylist = ({ trackIds }: { trackIds: string[] }) => {
  const [present, dismiss] = useIonModal(NewPlaylistModal, {
    trackIds,
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });

  const open = () =>
    present({
      presentingElement: document.getElementById("page")!,
    });

  return { open, close: dismiss };
};
