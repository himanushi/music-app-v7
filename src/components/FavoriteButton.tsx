import { IonButton } from "@ionic/react";
import { Icon } from ".";
import { useMe } from "~/hooks";
import { useMutation } from "@apollo/client";
import {
  ChangeFavoritesDocument,
  ChangeFavoritesInput,
  MeDocument,
} from "~/graphql/types";
import { useCallback } from "react";

type FavoriteButtonType = Exclude<
  keyof ChangeFavoritesInput,
  "favorite" | "clientMutationId"
>;

export const FavoriteButton = ({
  type,
  id,
  size,
}: {
  type: FavoriteButtonType;
  id: string;
  size?: "s" | "m" | "l";
}) => {
  const { onClick, isFavorite } = useChangeFavorite(type, id);

  return (
    <IonButton onClick={onClick}>
      <Icon
        size={size}
        name="favorite"
        slot="icon-only"
        color={isFavorite ? "red" : "dark"}
      />
    </IonButton>
  );
};

const useChangeFavorite = (type: FavoriteButtonType, id: string) => {
  const { isFavorite } = useMe();
  const [changeFavorite] = useMutation(ChangeFavoritesDocument, {
    refetchQueries: [MeDocument],
  });

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      changeFavorite({
        variables: { input: { [type]: [id], favorite: !isFavorite(id) } },
      });
    },
    [changeFavorite, id, isFavorite, type]
  );

  return { onClick, isFavorite: isFavorite(id) };
};
