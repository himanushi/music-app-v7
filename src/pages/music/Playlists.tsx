import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonSearchbar,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import {
  NewPlaylistButton,
  FavoriteButton,
  Page,
  Refresher,
  SquareImage,
} from "~/components";
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
import { convertImageUrl } from "~/lib";

const limit = 50;

const sortOptions = [
  ["更新日新しい順", "UPDATE.DESC"],
  ["更新日古い順", "UPDATE.ASC"],
  ["追加日新しい順", "NEW.DESC"],
  ["追加日古い順", "NEW.ASC"],
  ["人気順", "POPULARITY.DESC"],
];

export const Playlists = () => {
  const location = useLocation();
  const isMine = location.pathname === "/my-playlists";
  const { contentRef, scrollElement } = useScrollElement();

  const [variables, setNestedState] = useNestedState<PlaylistsQueryVariables>({
    conditions: { isMine },
    cursor: { limit, offset: 0 },
    sort: { order: "UPDATE", direction: "DESC" },
  });

  const { items, fetchMore, refresh } = useFetchItems<
    PlaylistObject,
    typeof PlaylistsDocument
  >({
    limit,
    doc: PlaylistsDocument,
    variables,
    refreshName: "playlists",
  });

  const { changeInput, changeFavorite, changeSort } = useVariablesItems({
    scrollElement,
    setNestedState,
  });

  return (
    <Page>
      <IonHeader translucent className="ion-no-border">
        <IonToolbar>
          <IonTitle>{isMine ? "マイ" : "共有"}プレイリスト</IonTitle>
          <IonButtons slot="start">
            <IonButton
              id={`playlist-filter-button${isMine ? "-my" : ""}`}
              color="main"
            >
              フィルター
            </IonButton>
            <IonPopover
              arrow={false}
              trigger={`playlist-filter-button${isMine ? "-my" : ""}`}
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
            <IonButton
              id={`playlist-sort-button${isMine ? "-my" : ""}`}
              color="main"
            >
              並び替え
            </IonButton>
            <IonPopover
              arrow={false}
              trigger={`playlist-sort-button${isMine ? "-my" : ""}`}
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
            placeholder="プレイリストで検索"
            debounce={2000}
            onIonInput={(ev) => changeInput(ev)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Refresher refresh={refresh} />
        <NewPlaylistButton />
        <Virtuoso
          key={JSON.stringify(variables)}
          useWindowScroll
          customScrollParent={scrollElement}
          totalCount={items.length}
          endReached={() => items.length >= limit && fetchMore()}
          itemContent={(index) => <PlaylistItem playlist={items[index]} />}
        />
      </IonContent>
    </Page>
  );
};

export const PlaylistItem = ({ playlist }: { playlist: PlaylistObject }) => {
  return (
    <IonItem button detail={false} routerLink={`/playlists/${playlist.id}`}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <SquareImage
          key={playlist.track?.artworkM?.url}
          src={convertImageUrl({ url: playlist.track?.artworkM?.url, px: 110 })}
        />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{playlist.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="playlistIds" id={playlist.id} size="s" />
      </IonButtons>
    </IonItem>
  );
};
