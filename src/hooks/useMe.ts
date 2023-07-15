import { useQuery } from "@apollo/client";
import { ActionEnum, CurrentUserObject, MeDocument } from "~/graphql/types";

export const useMe = () => {
  const { data } = useQuery(MeDocument, {
    fetchPolicy: "cache-first",
  });
  const me = data?.me;

  const allowed = (actionName: ActionEnum | ActionEnum[]) => {
    if (!me) return false;
    return isAllowed(me, actionName);
  };

  const favorite = (id: string) => {
    if (!me) return false;
    return isFavorite(me, id);
  };

  return { me, isAllowed: allowed, isFavorite: favorite };
};

const isAllowed = (
  me: CurrentUserObject,
  actionName: ActionEnum | ActionEnum[]
) =>
  typeof actionName === "string"
    ? me.role.allowedActions.includes(actionName)
    : actionName.every((action) => me.role.allowedActions.includes(action));

const isFavorite = (me: CurrentUserObject, id: string) =>
  [
    ...me.favorite.artistIds,
    ...me.favorite.albumIds,
    ...me.favorite.trackIds,
    ...me.favorite.playlistIds,
  ].includes(id);
