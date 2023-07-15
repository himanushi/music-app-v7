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
  IonButtons,
  IonButton,
  IonNote,
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
import { PlaylistDocument, PlaylistObject, TrackObject } from "~/graphql/types";
import { useMenu, useScrollElement } from "~/hooks";
import { convertDate, convertImageUrl, convertTime, toMs } from "~/lib";
import { TrackItem } from ".";

export const Playlist: React.FC<
  RouteComponentProps<{
    playlistId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(PlaylistDocument, {
    variables: { id: match.params.playlistId },
    fetchPolicy: "cache-first",
  });

  const playlist = data?.playlist;

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <PlaylistInfo playlist={playlist as PlaylistObject} />
        {playlist && (
          <PlaylistTracks
            tracks={playlist.items.map((i) => i.track)}
            scrollElement={scrollElement}
          />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const PlaylistInfo = ({ playlist }: { playlist?: PlaylistObject }) => {
  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              src={convertImageUrl({
                px: 300,
                url: playlist?.track?.artworkL?.url,
              })}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {playlist ? (
        <IonList>
          <IonItem className="text-select" lines="none">
            <IonLabel className="ion-text-wrap">{playlist.name}</IonLabel>
          </IonItem>
          <IonItem className="text-select" lines="none">
            <IonLabel className="ion-text-wrap">
              {playlist.description}
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <MenuButtons playlist={playlist} />
          </IonItem>
          {playlist.author && (
            <IonItem className="text-select" lines="none">
              <IonNote slot="end">
                {playlist.author.name}(@{playlist.author.username})
              </IonNote>
            </IonItem>
          )}
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonNote slot="end">
              {playlist.items.length}曲,{" "}
              {convertTime(toMs(playlist.items.map((i) => i.track)))}
            </IonNote>
          </IonItem>
          <IonItem className="text-select">
            <IonNote slot="end">
              作成 {convertDate(playlist.createdAt)}, 更新{" "}
              {convertDate(playlist.updatedAt)}
            </IonNote>
          </IonItem>
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const MenuButtons = ({ playlist }: { playlist: PlaylistObject }) => {
  const { open } = useMenu({
    component: ({ onDismiss }) => (
      <IonContent onClick={() => onDismiss()}>
        <AddPlaylistMenuItem
          trackIds={playlist?.items?.map((i) => i.track.id) ?? []}
        />
        <SpotifyItem name={playlist.name} />
      </IonContent>
    ),
  });

  return (
    <IonButtons slot="end">
      <FavoriteButton type="playlistIds" id={playlist?.id} size="s" />
      <IonButton onClick={(event) => open(event)}>
        <Icon name="more_horiz" slot="icon-only" />
      </IonButton>
    </IonButtons>
  );
};

const PlaylistTracks = ({
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
        itemContent={(index) => (
          <TrackItem track={tracks[index]} displayThumbnail />
        )}
      />
    </IonList>
  );
};
