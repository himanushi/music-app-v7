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
  IonNote,
  IonButtons,
  IonButton,
  IonAvatar,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import { useCallback, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon, SquareImage } from "~/components";
import {
  AlbumsDocument,
  ArtistsDocument,
  TrackDocument,
} from "~/graphql/types";
import { useScrollElement } from "~/hooks";
import { convertImageUrl, convertTime, toMs } from "~/lib";

export const Track: React.FC<
  RouteComponentProps<{
    trackId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(TrackDocument, {
    variables: { id: match.params.trackId },
    fetchPolicy: "cache-first",
  });

  const track = useMemo(() => data?.track, [data?.track]);

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
                  url: track?.artworkL?.url,
                })}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {track ? <IonLabel>{track.name}</IonLabel> : <IonSkeletonText />}
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {track ? (
              <IonNote slot="end">{convertTime(toMs([track]))}</IonNote>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
          <IonItemDivider sticky>トラック</IonItemDivider>
          <IonItem button detail={false}>
            {track ? (
              <>
                <IonThumbnail slot="start">
                  <img src={track.artworkM?.url} />
                </IonThumbnail>
                <IonLabel class="ion-text-wrap">{track.name}</IonLabel>
                <IonButtons slot="end">
                  <IonButton>
                    <Icon
                      size="s"
                      color="red"
                      slot="icon-only"
                      name="favorite"
                    />
                  </IonButton>
                  <IonButton>
                    <Icon size="m" slot="icon-only" name="more_horiz" />
                  </IonButton>
                </IonButtons>
              </>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
        </IonList>
        {track && (
          <TrackArtists trackId={track.id} scrollElement={scrollElement} />
        )}
        {track && (
          <TrackAlbums trackId={track.id} scrollElement={scrollElement} />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const TrackArtists = ({
  trackId,
  scrollElement,
}: {
  trackId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 50;

  const [offset, setOffset] = useState(limit);

  const { data, fetchMore } = useQuery(ArtistsDocument, {
    variables: {
      conditions: { trackIds: [trackId] },
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

  const artists = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    artists.length > 0 && (
      <IonList>
        <IonItemDivider sticky>アーティスト</IonItemDivider>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "44.5px" }}
          totalCount={artists.length}
          endReached={() => fetchItems(offset)}
          itemContent={(index) => (
            <IonItem button detail={false}>
              <IonAvatar slot="start" style={{ height: "60px", width: "60px" }}>
                <img src={`https://picsum.photos/id/${index + 100}/600`} />
              </IonAvatar>
              <IonLabel>{artists[index].name}</IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
        />
      </IonList>
    )
  );
};

const TrackAlbums = ({
  trackId,
  scrollElement,
}: {
  trackId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 50;

  const [offset, setOffset] = useState(limit);

  const { data, fetchMore } = useQuery(AlbumsDocument, {
    variables: {
      conditions: { trackIds: [trackId] },
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

  const artists = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    artists.length > 0 && (
      <IonList>
        <IonItemDivider sticky>アルバム</IonItemDivider>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "44.5px" }}
          totalCount={artists.length}
          endReached={() => fetchItems(offset)}
          itemContent={(index) => (
            <IonItem button detail={false}>
              <IonThumbnail
                slot="start"
                style={{ height: "110px", width: "110px" }}
              >
                <img src={artists[index].artworkM?.url} />
              </IonThumbnail>
              <IonLabel>{artists[index].name}</IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
        />
      </IonList>
    )
  );
};
