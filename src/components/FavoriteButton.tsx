import { IonButton } from "@ionic/react";
import { Icon } from ".";
import { useMe } from "~/hooks";

export const FavoriteButton = ({
  id,
  size,
}: {
  id: string;
  size?: "s" | "m" | "l";
}) => {
  const { isFavorite } = useMe();

  return (
    <IonButton>
      <Icon
        size={size}
        name="favorite"
        slot="icon-only"
        color={isFavorite(id) ? "red" : "dark"}
      />
    </IonButton>
  );
};
