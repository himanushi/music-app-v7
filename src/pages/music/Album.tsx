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
  IonButton,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  AddPlaylistMenuItem,
  FavoriteButton,
  FooterPadding,
  Icon,
  SkeletonItems,
  SpotifyItem,
  SquareImage,
} from "~/components";
import { AppleMusicItem } from "~/components/searchItem/appleMusicItem";
import {
  AlbumDocument,
  AlbumObject,
  ArtistObject,
  ArtistsDocument,
  TrackObject,
} from "~/graphql/types";
import { useFetchItems, useMenu, useScrollElement } from "~/hooks";
import { convertDate, convertImageUrl, convertTime, toMs } from "~/lib";
import { ArtistItem, TrackItem } from ".";

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

  const album = data?.album;
  const tracks = album?.tracks ?? [];

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <AlbumInfo album={album as AlbumObject} />
        {album ? (
          <AlbumTracks
            tracks={tracks as TrackObject[]}
            scrollElement={scrollElement}
          />
        ) : (
          <SkeletonItems count={10} />
        )}
        {album ? (
          <AlbumArtists albumId={album.id} scrollElement={scrollElement} />
        ) : (
          <SkeletonItems count={5} />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const AlbumInfo = ({ album }: { album?: AlbumObject }) => {
  return (
    <>
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
      {album ? (
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonLabel>{album.name}</IonLabel>
          </IonItem>
          <AppleMusicItem
            isAppleMusic={album.appleMusicPlayable}
            appleMusicId={album.appleMusicId}
          />
          <IonItem lines="none">
            <AlbumMenuButtons album={album as AlbumObject} />
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonNote slot="end">{album.copyright}</IonNote>
          </IonItem>
          <IonItem className="ion-text-wrap text-select">
            <IonNote slot="end">
              {convertDate(album.releaseDate)}, {album.tracks.length}曲,{" "}
              {convertTime(toMs(album.tracks))}
            </IonNote>
          </IonItem>
          {album.status !== "ACTIVE" && (
            <IonItem color={album.status === "PENDING" ? "yellow" : "red"}>
              {album.status}
            </IonItem>
          )}
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const AlbumMenuButtons = ({ album }: { album: AlbumObject }) => {
  const { open } = useMenu({
    component: ({ onDismiss }) => (
      <IonContent onClick={() => onDismiss()}>
        <AddPlaylistMenuItem trackIds={album?.tracks.map((t) => t.id) ?? []} />
        <SpotifyItem name={album.name} />
      </IonContent>
    ),
  });

  return (
    <IonButtons slot="end">
      <FavoriteButton type="albumIds" id={album?.id} size="s" />
      <IonButton onClick={(event) => open(event)}>
        <Icon name="more_horiz" slot="icon-only" />
      </IonButton>
    </IonButtons>
  );
};

const AlbumTracks = ({
  tracks,
  scrollElement,
}: {
  tracks: TrackObject[];
  scrollElement: HTMLElement | undefined;
}) => {
  return (
    <IonList>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={tracks.length}
        itemContent={(index) => <TrackItem track={tracks[index]} />}
      />
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
  const limit = 50;
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
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={artists.length}
        endReached={() => fetchMore()}
        itemContent={(index) => <ArtistItem artist={artists[index]} />}
      />
    </IonList>
  );
};
