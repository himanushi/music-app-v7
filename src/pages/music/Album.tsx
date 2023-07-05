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
} from "@ionic/react";
import { Fragment, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon, SquareImage } from "~/components";
import {
  AlbumDocument,
  ArtistObject,
  ArtistsDocument,
  TrackObject,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";
import { convertDate, convertImageUrl, convertTime, toMs } from "~/lib";

export const Album: React.FC<
  RouteComponentProps<{
    albumId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(AlbumDocument, {
    variables: { id: match.params.albumId },
    fetchPolicy: "cache-first",
  });

  const album = useMemo(() => data?.album, [data?.album]);
  const tracks = useMemo(() => album?.tracks ?? [], [album?.tracks]);

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
                  url: album?.artworkL?.url,
                })}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {album ? <IonLabel>{album.name}</IonLabel> : <IonSkeletonText />}
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {album ? (
              <IonNote slot="end">{album?.copyright}</IonNote>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            {album ? (
              <IonNote slot="end">
                {convertDate(album.releaseDate)}, {album.tracks.length}曲,{" "}
                {convertTime(toMs(album.tracks))}
              </IonNote>
            ) : (
              <IonSkeletonText />
            )}
          </IonItem>
          <IonItem button detail={false}>
            <IonButtons slot="end">
              <IonButton>
                <Icon size="s" color="red" slot="icon-only" name="favorite" />
              </IonButton>
            </IonButtons>
          </IonItem>
        </IonList>
        {album ? (
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
        )}
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

const limit = 50;

const AlbumArtists = ({
  albumId,
  scrollElement,
}: {
  albumId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const { items: artists, fetchMore } = useFetchItems<ArtistObject>({
    limit,
    doc: ArtistsDocument,
    variables: {
      conditions: { albumIds: [albumId] },
      cursor: { limit, offset: 0 },
      sort: { direction: "DESC", order: "POPULARITY" },
    },
  });

  return (
    <IonList>
      <IonItemDivider sticky>アーティスト</IonItemDivider>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        style={{ height: "44.5px" }}
        totalCount={artists.length}
        endReached={() => fetchMore()}
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
