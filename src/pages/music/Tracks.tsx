import { Capacitor } from "@capacitor/core";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonSearchbar,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, FooterPadding, Refresher } from "~/components";
import {
  TrackObject,
  TracksDocument,
  TracksQueryVariables,
} from "~/graphql/types";
import {
  useFetchItems,
  useNestedState,
  useScrollElement,
  useVariablesItems,
} from "~/hooks";
import { convertImageUrl } from "~/lib";

const limit = 50;

const sortOptions = [
  ["追加日新しい順", "NEW.DESC"],
  ["追加日古い順", "NEW.ASC"],
  ["人気順", "POPULARITY.DESC"],
];

export const Tracks = () => {
  const { contentRef, scrollElement } = useScrollElement();

  const [variables, setNestedState] = useNestedState<TracksQueryVariables>({
    conditions: {},
    cursor: { limit, offset: 0 },
    sort: { order: "NEW", direction: "DESC" },
  });

  const { items, fetchMore, resetOffset, refresh } = useFetchItems<TrackObject>(
    {
      limit,
      doc: TracksDocument,
      variables,
      refreshName: "tracks",
    }
  );

  const { changeInput, changeFavorite, changeSort } = useVariablesItems({
    resetOffset,
    scrollElement,
    setNestedState,
  });

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
        {Capacitor.isNativePlatform() && <IonToolbar />}
        <IonToolbar>
          <IonTitle>トラック</IonTitle>
          <IonButtons slot="start">
            <IonButton id="track-filter-button" color="main">
              フィルター
            </IonButton>
            <IonPopover
              arrow={false}
              trigger="track-filter-button"
              side="bottom"
              alignment="start"
              dismissOnSelect={true}
            >
              <IonList>
                <IonItem button detail={false} color="dark">
                  <IonCheckbox
                    color="main"
                    checked={!!variables.conditions?.favorite}
                    onIonChange={changeFavorite}
                  >
                    お気に入り
                  </IonCheckbox>
                </IonItem>
              </IonList>
            </IonPopover>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton id="track-sort-button" color="main">
              並び替え
            </IonButton>
            <IonPopover
              arrow={false}
              trigger="track-sort-button"
              side="bottom"
              alignment="start"
              dismissOnSelect={true}
            >
              <IonList>
                {sortOptions.map((sort, index) => (
                  <IonItem
                    button
                    detail={false}
                    key={index}
                    onClick={() => changeSort(sort[1])}
                    color="dark"
                  >
                    {sort[0]}
                  </IonItem>
                ))}
              </IonList>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            placeholder="トラックで検索"
            debounce={2000}
            onIonInput={(ev) => changeInput(ev)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Refresher refresh={refresh} />
        <Virtuoso
          key={JSON.stringify(variables)}
          useWindowScroll
          customScrollParent={scrollElement}
          totalCount={items.length}
          endReached={() => items.length >= limit && fetchMore()}
          itemContent={(index) => <TrackItem track={items[index]} />}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

export const TrackItem = ({ track }: { track: TrackObject }) => {
  return (
    <IonItem button detail={false}>
      <IonThumbnail slot="start" style={{ height: "50px", width: "50px" }}>
        <img src={convertImageUrl({ url: track.artworkM?.url, px: 50 })} />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{track.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="trackIds" id={track.id} size="s" />
      </IonButtons>
    </IonItem>
  );
};
