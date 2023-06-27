import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
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
} from "@ionic/react";
import { Fragment } from "react";
import { Virtuoso } from "react-virtuoso";
import { Icon, SquareImage } from "~/components";
import { useScrollElement } from "~/hooks";

export const Album = () => {
  const { contentRef, scrollElement } = useScrollElement();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Album</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <SquareImage src="https://picsum.photos/seed/picsum/600/600" />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem className="ion-text-wrap">
            タイトルタイトルタイトルタイトルタイトルタイトルタイトル
          </IonItem>
          <IonItem className="ion-text-wrap">会社名</IonItem>
          <IonItem>
            <IonLabel>配信日</IonLabel>
            <IonNote>2023年6月23日</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>曲数</IonLabel>
            <IonNote>100曲</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>再生時間</IonLabel>
            <IonNote>1時間</IonNote>
          </IonItem>
        </IonList>
        <AlbumTracks scrollElement={scrollElement} />
        <AlbumArtists scrollElement={scrollElement} />
        <IonItem lines="none" />
      </IonContent>
    </IonPage>
  );
};

type Track = {
  name: string;
  trackNumber: number;
};

const AlbumTracks = ({
  scrollElement,
}: {
  scrollElement: HTMLElement | undefined;
}) => {
  const tracks: Track[] = [...Array(100)].map((_, i) => ({
    name: `Track ${(i % 12) + 1} ${
      i % 4 === 0 ? " (feat. Artist Artist Artist Artist Artist Artist)" : ""
    }`,
    trackNumber: (i % 12) + 1,
  }));
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
          <IonItemDivider key={i} sticky>
            Disc {i + 1}
          </IonItemDivider>
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

type Artist = {
  name: string;
};

const AlbumArtists = ({
  scrollElement,
}: {
  scrollElement: HTMLElement | undefined;
}) => {
  const artists: Artist[] = [...Array(10)].map((_, i) => ({
    name: `Artist ${(i % 12) + 1}`,
  }));

  return (
    <IonList>
      <IonItemDivider sticky>Artists</IonItemDivider>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        style={{ height: "44.5px" }}
        totalCount={artists.length}
        itemContent={(index) => (
          <IonItem button detail={false}>
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
