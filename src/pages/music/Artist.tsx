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
  IonItemDivider,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import { useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon, SquareImage } from "~/components";
import { AlbumsDocument, ArtistDocument, ArtistObject } from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";
import { convertImageUrl } from "~/lib";

export const Artist: React.FC<
  RouteComponentProps<{
    artistId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(ArtistDocument, {
    variables: { id: match.params.artistId },
    fetchPolicy: "cache-first",
  });

  const artist = useMemo(() => data?.artist, [data?.artist]);

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
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
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {artist ? <IonLabel>{artist.name}</IonLabel> : <IonSkeletonText />}
          </IonItem>
        </IonList>
        {artist ? (
          <ArtistAlbums artistId={artist.id} scrollElement={scrollElement} />
        ) : (
          <IonList>
            <IonItemDivider sticky>アーティスト</IonItemDivider>
            {[...Array(5)].map((_, i) => (
              <IonItem button detail={false} key={i}>
                <IonSkeletonText />
              </IonItem>
            ))}
          </IonList>
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const limit = 50;

const ArtistAlbums = ({
  artistId,
  scrollElement,
}: {
  artistId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const { items: albums, fetchMore } = useFetchItems<ArtistObject>({
    limit,
    doc: AlbumsDocument,
    variables: {
      conditions: { artistIds: [artistId] },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
  });

  return (
    <IonList>
      <IonItemDivider sticky>アルバム</IonItemDivider>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={albums.length}
        endReached={() => fetchMore()}
        itemContent={(index) => (
          <IonItem
            button
            detail={false}
            routerLink={`/albums/${albums[index].id}`}
          >
            <IonThumbnail
              slot="start"
              style={{ height: "110px", width: "110px" }}
            >
              <img src={albums[index].artworkM?.url} />
            </IonThumbnail>
            <IonLabel class="ion-text-wrap">{albums[index].name}</IonLabel>
            <IonButtons slot="end">
              <IonButton>
                <Icon size="s" color="red" slot="icon-only" name="favorite" />
              </IonButton>
              <IonButton>
                <Icon size="m" slot="icon-only" name="more_horiz" />
              </IonButton>
            </IonButtons>
          </IonItem>
        )}
      />
    </IonList>
  );
};
