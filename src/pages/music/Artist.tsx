import { useQuery } from "@apollo/client";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonButtons,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  FavoriteButton,
  FooterPadding,
  SkeletonItems,
  SquareImage,
} from "~/components";
import {
  AlbumObject,
  AlbumsDocument,
  ArtistDocument,
  ArtistObject,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";
import { convertImageUrl } from "~/lib";
import { AlbumItem } from ".";

export const Artist: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(ArtistDocument, {
    variables: { id: match.params.id },
    fetchPolicy: "cache-first",
  });

  const artist = data?.artist;

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <ArtistInfo artist={artist as ArtistObject} />
        {artist ? (
          <ArtistAlbums artistId={artist.id} scrollElement={scrollElement} />
        ) : (
          <SkeletonItems count={10} />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const ArtistInfo = ({ artist }: { artist?: ArtistObject }) => {
  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              src={convertImageUrl({
                px: 300,
                url: artist?.artworkL?.url,
              })}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {artist ? (
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonLabel>{artist.name}</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonButtons slot="end">
              <FavoriteButton type="artistIds" id={artist?.id} size="s" />
            </IonButtons>
          </IonItem>
          {artist.status !== "ACTIVE" && (
            <IonItem color={artist.status === "PENDING" ? "yellow" : "red"}>
              {artist.status}
            </IonItem>
          )}
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const ArtistAlbums = ({
  artistId,
  scrollElement,
}: {
  artistId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 50;
  const { items, fetchMore } = useFetchItems<
    AlbumObject,
    typeof AlbumsDocument
  >({
    limit,
    doc: AlbumsDocument,
    variables: {
      conditions: { artistIds: [artistId] },
      cursor: { limit, offset: 0 },
      sort: { order: "RELEASE", direction: "DESC" },
    },
  });

  if (items.length === 0) return <></>;

  return (
    <IonList>
      <IonItem>
        <IonNote>アルバム</IonNote>
      </IonItem>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={items.length}
        endReached={() => items.length >= limit && fetchMore()}
        itemContent={(index) => <AlbumItem album={items[index]} />}
      />
    </IonList>
  );
};
