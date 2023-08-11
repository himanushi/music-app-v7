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
  IonNote,
  IonPopover,
  IonReorder,
  IonSearchbar,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  AddPlaylistMenuItem,
  FavoriteButton,
  Icon,
  Page,
  Refresher,
  SquareImage,
} from "~/components";
import {
  TrackObject,
  TracksDocument,
  TracksQueryVariables,
} from "~/graphql/types";
import {
  useFetchItems,
  useMenu,
  useNestedState,
  useScrollElement,
  useStartedServiceState,
  useVariablesItems,
} from "~/hooks";
import { convertImageUrl, toTrack } from "~/lib";
import { Track, musicPlayerService } from "~/machines/musicPlayerMachine";

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

  const { items, fetchMore, refresh } = useFetchItems<
    TrackObject,
    typeof TracksDocument
  >({
    limit,
    doc: TracksDocument,
    variables,
    refreshName: "tracks",
  });

  const tracks: Track[] = items.map((item) => toTrack(item));

  const { changeInput, changeFavorite, changeSort } = useVariablesItems({
    scrollElement,
    setNestedState,
  });

  return (
    <Page>
      <IonHeader translucent className="ion-no-border">
        {Capacitor.isNativePlatform() && <IonToolbar />}
        <IonToolbar>
          <IonTitle>曲</IonTitle>
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
            placeholder="曲で検索"
            debounce={2000}
            onIonInput={(ev) => changeInput(ev)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        <Refresher refresh={refresh} />
        <Virtuoso
          key={JSON.stringify(variables)}
          useWindowScroll
          customScrollParent={scrollElement}
          totalCount={items.length}
          endReached={() => items.length >= limit && fetchMore()}
          itemContent={(index) => (
            <TrackItem
              index={index}
              tracks={tracks}
              track={tracks[index]}
              displayThumbnail
            />
          )}
        />
      </IonContent>
    </Page>
  );
};

export const TrackItem = ({
  index,
  track,
  tracks,
  displayThumbnail = false,
  reorder = false,
}: {
  index: number;
  track: Track;
  tracks: Track[];
  displayThumbnail?: boolean;
  reorder?: boolean;
}) => {
  useStartedServiceState(musicPlayerService);

  const onClick = useCallback(async () => {
    musicPlayerService.send({
      type: "REPLACE_AND_PLAY",
      tracks,
      currentPlaybackNo: index,
    });
  }, [tracks, index]);

  const playing =
    musicPlayerService.getSnapshot().context.currentTrack?.appleMusicId ===
    track.appleMusicId;

  return (
    <IonItem
      button
      detail={false}
      onClick={onClick}
      color={playing ? "main" : ""}
    >
      {displayThumbnail ? (
        <IonThumbnail slot="start" style={{ height: "50px", width: "50px" }}>
          <SquareImage
            key={track.artworkUrl}
            src={convertImageUrl({ url: track.artworkUrl, px: 50 })}
          />
        </IonThumbnail>
      ) : (
        <IonNote slot="start">{track.trackNumber}</IonNote>
      )}
      <IonLabel class="ion-text-wrap">{track.name}</IonLabel>
      {reorder ? (
        <IonButtons
          slot="end"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          <FavoriteButton type="trackIds" id={track.id} size="s" />
          <IonButton
            color="main"
            onClick={() =>
              musicPlayerService.send({ type: "REMOVE_TRACK", index })
            }
          >
            <Icon name="delete" slot="icon-only" color="red" size="s" />
          </IonButton>
          <IonReorder />
        </IonButtons>
      ) : (
        <TrackItemButtons track={track} />
      )}
    </IonItem>
  );
};

const TrackItemButtons = ({ track }: { track: Track }) => {
  const history = useHistory();
  const { open } = useMenu({
    component: ({ onDismiss }) => (
      <IonContent onClick={() => onDismiss()}>
        <AddPlaylistMenuItem trackIds={[track.id]} />
        <IonItem
          button
          color="dark"
          detail={false}
          onClick={() => history.push(`/tracks/${track.id}`)}
        >
          <IonLabel>トラックを表示</IonLabel>
        </IonItem>
      </IonContent>
    ),
  });

  return (
    <IonButtons
      slot="end"
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
      }}
    >
      <FavoriteButton type="trackIds" id={track.id} size="s" />
      <IonButton onClick={(event) => open(event)}>
        <Icon name="more_horiz" slot="icon-only" />
      </IonButton>
    </IonButtons>
  );
};
