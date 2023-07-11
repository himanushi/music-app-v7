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
import { useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, FooterPadding, Icon, Refresher } from "~/components";
import { AddPlaylistItemsModal } from "~/components/AddPlaylistItemsModal";
import {
  AlbumObject,
  AlbumsDocument,
  AlbumsQueryVariables,
  StatusEnum,
} from "~/graphql/types";
import {
  useFetchItems,
  useMe,
  useNestedState,
  useScrollElement,
  useVariablesItems,
} from "~/hooks";
import { ClickEvent } from "~/types";

const limit = 50;

const sortOptions = [
  ["配信日新しい順", "RELEASE.DESC"],
  ["配信日古い順", "RELEASE.ASC"],
  ["追加日新しい順", "NEW.DESC"],
  ["追加日古い順", "NEW.ASC"],
  ["人気順", "POPULARITY.DESC"],
];

const statusOptions: [string, StatusEnum][] = [
  ["有効のみ表示", "ACTIVE"],
  ["保留のみ表示", "PENDING"],
  ["除外のみ表示", "IGNORE"],
];

export const Albums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const { isAllowed } = useMe();

  const [variables, setNestedState] = useNestedState<AlbumsQueryVariables>({
    conditions: {},
    cursor: { limit, offset: 0 },
    sort: { order: "RELEASE", direction: "DESC" },
  });

  const {
    items: albums,
    fetchMore,
    resetOffset,
    refresh,
  } = useFetchItems<AlbumObject>({
    limit,
    doc: AlbumsDocument,
    variables,
    refreshName: "albums",
  });

  const { changeInput, changeFavorite, changeSort, changeStatus } =
    useVariablesItems({
      resetOffset,
      scrollElement,
      setNestedState,
    });

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
        {Capacitor.isNativePlatform() && <IonToolbar />}
        <IonToolbar>
          <IonTitle>アルバム</IonTitle>
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
                {isAllowed("changeAlbumStatus") && (
                  <>
                    {statusOptions.map((status, index) => (
                      <IonItem
                        button
                        detail={false}
                        key={index}
                        onClick={() => changeStatus(status[1])}
                      >
                        <IonCheckbox
                          color="main"
                          checked={
                            variables.conditions?.status?.includes(status[1]) ||
                            (status[1] === "ACTIVE" &&
                              variables.conditions?.status === undefined)
                          }
                          onIonChange={changeFavorite}
                        >
                          {status[0]}
                        </IonCheckbox>
                      </IonItem>
                    ))}
                  </>
                )}
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
            placeholder="アルバムで検索"
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
          style={{ height: "100%" }}
          totalCount={albums.length}
          endReached={() => albums.length >= limit && fetchMore()}
          itemContent={(index) => <AlbumItem album={albums[index]} />}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

export const AlbumItem = ({ album }: { album: AlbumObject }) => {
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMenu = (event: ClickEvent<HTMLIonButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (popover.current) {
      popover.current.event = event;
      popover.current.present();
    }
  };

  const closeMenu = () => {
    popover.current?.dismiss();
  };

  return (
    <IonItem button detail={false} routerLink={`/albums/${album.id}`}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <img src={album.artworkM?.url} />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{album.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="albumIds" id={album.id} size="s" />
        <IonButton onClick={openMenu}>
          <Icon name="more_horiz" slot="icon-only" />
        </IonButton>
        <IonPopover arrow={false} ref={popover} side="left">
          <IonContent>
            <IonList
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              <IonItem
                onClick={() => {
                  popover.current?.dismiss();
                  setIsModalOpen(true);
                }}
                color="dark"
                button
                detail={false}
              >
                <IonLabel>プレイリストに追加</IonLabel>
              </IonItem>
              <IonItem onClick={closeMenu} color="dark" button detail={false}>
                <IonLabel>再生</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </IonButtons>
      <AddPlaylistItemsModal
        trackIds={album.tracks?.map((t) => t.id) ?? []}
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
      />
    </IonItem>
  );
};
