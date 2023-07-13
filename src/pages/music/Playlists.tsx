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
import { useCallback, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, FooterPadding, Icon } from "~/components";
import {
  PlaylistObject,
  PlaylistsDocument,
  PlaylistsQueryVariables,
} from "~/graphql/types";
import {
  useFetchItems,
  useNestedState,
  useScrollElement,
  useVariablesItems,
} from "~/hooks";

const limit = 50;

const sortOptions = [
  ["更新日新しい順", "UPDATE.DESC"],
  ["更新日古い順", "UPDATE.ASC"],
  ["追加日新しい順", "NEW.DESC"],
  ["追加日古い順", "NEW.ASC"],
  ["人気順", "POPULARITY.DESC"],
];

export const Playlists = () => {
  const { contentRef, scrollElement } = useScrollElement();

  const [variables, setNestedState] = useNestedState<PlaylistsQueryVariables>({
    conditions: {},
    cursor: { limit, offset: 0 },
    sort: { order: "UPDATE", direction: "DESC" },
  });

  const {
    items: playlists,
    fetchMore,
    resetOffset,
  } = useFetchItems<PlaylistObject>({
    limit,
    doc: PlaylistsDocument,
    variables,
  });

  const { changeInput, changeFavorite, changeSort } = useVariablesItems({
    resetOffset,
    scrollElement,
    setNestedState,
  });

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
        <IonToolbar>
          <IonTitle>プレイリスト</IonTitle>
          <IonButtons slot="start">
            <IonButton id="album-filter-button" color="main">
              フィルター
            </IonButton>
            <IonPopover
              arrow={false}
              trigger="album-filter-button"
              side="bottom"
              alignment="start"
              dismissOnSelect={true}
            >
              <IonList>
                <IonItem button detail={false}>
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
            <IonButton id="album-sort-button" color="main">
              並び替え
            </IonButton>
            <IonPopover
              arrow={false}
              trigger="album-sort-button"
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
            placeholder="プレイリストで検索"
            debounce={2000}
            onIonInput={(ev) => changeInput(ev)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Virtuoso
          key={playlists[0]?.id}
          useWindowScroll
          customScrollParent={scrollElement}
          totalCount={playlists.length}
          endReached={() => playlists.length >= limit && fetchMore()}
          itemContent={(index) => <PlaylistItem playlist={playlists[index]} />}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

export const PlaylistItem = ({ playlist }: { playlist: PlaylistObject }) => {
  const popover = useRef<HTMLIonPopoverElement>(null);
  const open = useCallback(
    (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
      event.stopPropagation();
      event.preventDefault();
      if (popover.current) {
        popover.current.event = event;
        popover.current.present();
      }
    },
    []
  );
  const close = useCallback(() => popover.current?.dismiss(), []);

  return (
    <IonItem button detail={false} routerLink={`/playlists/${playlist.id}`}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <img src={playlist.track?.artworkM?.url} />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{playlist.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="playlistIds" id={playlist.id} size="s" />
        <IonButton onClick={open}>
          <Icon name="more_horiz" slot="icon-only" />
        </IonButton>
        <IonPopover ref={popover} style={{ "--width": "250px" }} side="left">
          <IonContent>
            <IonList onClick={close}>
              <IonItem color="dark" button detail={false}>
                <Icon name="playlist_add_check" slot="end" />
                <IonLabel>プレイリストに追加</IonLabel>
              </IonItem>
              <IonItem color="dark" button detail={false}>
                <Icon name="play_arrow" slot="end" />
                <IonLabel>再生</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </IonButtons>
    </IonItem>
  );
};
