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
} from "@ionic/react";
import { Virtuoso } from "react-virtuoso";
import { SquareImage } from "~/components";
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
          <IonItem lines="none">
            <IonLabel>再生時間</IonLabel>
            <IonNote>1時間</IonNote>
          </IonItem>
        </IonList>
        <AlbumTracks scrollElement={scrollElement} />
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
    name: `Track ${(i % 12) + 1}`,
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
        <>
          <IonItemDivider key={i} style={{ height: "44.5px" }} sticky>
            Disc {i + 1}
          </IonItemDivider>
          <Virtuoso
            useWindowScroll
            customScrollParent={scrollElement}
            style={{ height: "44.5px" }}
            totalCount={tracks.length}
            itemContent={(index) => (
              <IonItem key={`${i}_${index}`} style={{ height: "45px" }}>
                <IonNote slot="start">{tracks[index].trackNumber}</IonNote>
                <IonLabel>{tracks[index].name}</IonLabel>
              </IonItem>
            )}
          />
        </>
      ))}
    </IonList>
  );
};
