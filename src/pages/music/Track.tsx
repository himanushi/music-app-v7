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
import { Fragment, useCallback, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon, SquareImage } from "~/components";
import { ArtistsDocument, TrackDocument, TrackObject } from "~/graphql/types";
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
            {track ? (
              <IonNote slot="end">{convertTime(toMs([track]))}</IonNote>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
          <IonItem button detail={false}>
            {track ? (
              <>
                <IonButtons slot="start">
                  <IonButton>
                    <Icon size="m" slot="icon-only" name="play_arrow" />
                  </IonButton>
                </IonButtons>
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
        {/* {album ? (
          <AlbumTracks
            tracks={tracks as TrackObject[]}
            scrollElement={scrollElement}
          />
        ) : (
          <IonList>
            <IonItemDivider sticky>トラック</IonItemDivider>
            {[...Array(10)].map((_, i) => (
              <IonItem button detail={false} key={i}>
                <IonSkeletonText />
              </IonItem>
            ))}
          </IonList>
        )}
        {album ? (
          <AlbumArtists albumId={album.id} scrollElement={scrollElement} />
        ) : (
          <IonList>
            <IonItemDivider sticky>アーティスト</IonItemDivider>
            {[...Array(5)].map((_, i) => (
              <IonItem button detail={false} key={i}>
                <IonSkeletonText />
              </IonItem>
            ))}
          </IonList>
        )} */}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const AlbumTracks = ({
  tracks,
  scrollElement,
}: {
  tracks: TrackObject[];
  scrollElement: HTMLElement | undefined;
}) => {
  const discTracks = tracks.reduce(
    (discs: TrackObject[][], track) =>
      track.trackNumber === 1
        ? [...discs, [track]]
        : [...discs.slice(0, -1), [...discs[discs.length - 1], track]],
    []
  );

  return (
    <IonList>
      {discTracks.map((tracks, i) => (
        <Fragment key={i}>
          {discTracks.length >= 2 ? (
            <IonItemDivider sticky>ディスク {i + 1}</IonItemDivider>
          ) : (
            <IonItemDivider sticky>トラック</IonItemDivider>
          )}
          <Virtuoso
            useWindowScroll
            customScrollParent={scrollElement}
            style={{ height: "44.5px" }}
            totalCount={tracks.length}
            itemContent={(index) => (
              <IonItem button detail={false}>
                <IonNote slot="start">{tracks[index].trackNumber}</IonNote>
                <IonLabel class="ion-text-wrap">{tracks[index].name}</IonLabel>
                <IonButtons slot="end">
                  <IonButton>
                    <Icon
                      size="s"
                      color="red"
                      slot="icon-only"
                      name="favorite"
                    />
                  </IonButton>
                </IonButtons>
              </IonItem>
            )}
          />
        </Fragment>
      ))}
    </IonList>
  );
};

const AlbumArtists = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const limit = 10;

  const [offset, setOffset] = useState(limit);

  const { data, fetchMore } = useQuery(ArtistsDocument, {
    variables: {
      conditions: { albumIds: [albumId] },
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
  );
};
