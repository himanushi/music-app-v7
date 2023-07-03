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
import { useCallback, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon, SquareImage } from "~/components";
import { AlbumsDocument, ArtistDocument } from "~/graphql/types";
import { useScrollElement } from "~/hooks";
import { convertImageUrl } from "~/lib";

export const Artist: React.FC<
  RouteComponentProps<{
    albumId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(ArtistDocument, {
    variables: { id: match.params.albumId },
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

const ArtistAlbums = ({
  artistId,
  scrollElement,
}: {
  artistId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 50;

  const [offset, setOffset] = useState(limit);

  const { data, fetchMore } = useQuery(AlbumsDocument, {
    variables: {
      conditions: { artistIds: [artistId] },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
    fetchPolicy: "cache-first",
  });

  const fetchItems = useCallback(
    (offset: number) => {
      setOffset((prevOffset) => prevOffset + limit);
      fetchMore({
        variables: {
          cursor: { limit, offset: offset },
        },
      });
    },
    [fetchMore]
  );

  const albums = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    <IonList>
      <IonItemDivider sticky>アルバム</IonItemDivider>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        style={{ height: "44.5px" }}
        totalCount={albums.length}
        endReached={() => fetchItems(offset)}
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
