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
} from "@ionic/react";
import { Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon, SquareImage } from "~/components";
import { useScrollElement } from "~/hooks";

type Track = {
  name: string;
  trackNumber: number;
};

type Artist = {
  name: string;
};

export const Album: React.FC<
  RouteComponentProps<{
    albumId: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();
  const tracks: Track[] = [...Array(parseInt(match.params.albumId))].map(
    (_, i) => ({
      name: `Track ${(i % 12) + 1} ${
        i % 4 === 0
          ? " (feat. Artist Artist Artist Artist Artist Artist Artist Artist Artist)"
          : ""
      }`,
      trackNumber: (i % 12) + 1,
    })
  );

  const artists: Artist[] = [...Array(parseInt(match.params.albumId))].map(
    (_, i) => ({
      name: `Artist ${(i % 12) + 1}`,
    })
  );

  return (
    <IonPage>
      <IonHeader translucent class="ion-no-border" collapse="fade">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <SquareImage
                src={`https://picsum.photos/id/${match.params.albumId}/600`}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            タイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </IonItem>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonNote slot="end">会社名</IonNote>
          </IonItem>
          <IonItem className="ion-text-wrap text-select">
            <IonNote slot="end">2023年6月23日, 100曲, 1時間</IonNote>
          </IonItem>
        </IonList>
        <AlbumTracks tracks={tracks} scrollElement={scrollElement} />
        <AlbumArtists artists={artists} scrollElement={scrollElement} />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const AlbumTracks = ({
  tracks,
  scrollElement,
}: {
  tracks: Track[];
  scrollElement: HTMLElement | undefined;
}) => {
  const discTracks = tracks.reduce(
    (discs: Track[][], track) =>
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
  artists,
  scrollElement,
}: {
  artists: Artist[];
  scrollElement: HTMLElement | undefined;
}) => {
  return (
    <IonList>
      <IonItemDivider sticky>アーティスト</IonItemDivider>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        style={{ height: "44.5px" }}
        totalCount={artists.length}
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
