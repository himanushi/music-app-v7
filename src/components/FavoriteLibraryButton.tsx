import { IonButton } from "@ionic/react";
import { Icon } from ".";
import { client } from "~/graphql/client";
import { useEffect, useState } from "react";
import { RatingsDocument, ratingAttributes } from "~/graphql/appleMusicClient";
import { gql, useQuery } from "@apollo/client";
import { getApolloData } from "~/lib";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";

export const FavoriteLibraryButton = ({
  type,
  id,
  size,
}: {
  type: MusicKit.AppleMusicAPI.RatingType;
  id: string;
  size?: "s" | "m" | "l";
}) => {
  const [favorite, setFavorite] = useState(false);

  const { data } = useQuery(RatingsDocument, {
    variables: { ids: [id], type },
    fetchPolicy: "cache-only",
  });

  const item = data?.items && data?.items[0];

  useEffect(() => {
    if (!item) return;
    setFavorite(item.attributes?.value === 1);
  }, [item]);

  useEffect(() => {
    if (!client.current) return;

    const data = getApolloData<MusicKit.Ratings>({
      id,
      typeName: "Rating",
      attributes: ratingAttributes,
    });

    if (data) setFavorite(data.attributes?.value === 1);
  }, [id]);

  const onClick = async () => {
    if (favorite) {
      try {
        client.current?.writeFragment({
          id: `Rating:${id}`,
          fragment: gql`
            fragment MyFragment on Rating {
              attributes {
                value
              }
            }
          `,
          data: {
            attributes: {
              value: 0,
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
      await CapacitorMusicKit.deleteRating({ id, type });
    } else {
      await CapacitorMusicKit.addRating({ id, value: 1, type });
    }
    await client.current?.query({
      query: RatingsDocument,
      variables: { ids: [id], type },
      fetchPolicy: "network-only",
    });
    setFavorite(!favorite);
  };

  return (
    <IonButton onClick={onClick}>
      <Icon
        size={size}
        name="favorite"
        slot="icon-only"
        color={favorite ? "red" : "dark"}
      />
    </IonButton>
  );
};
