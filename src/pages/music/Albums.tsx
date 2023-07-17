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
import { convertImageUrl } from "~/lib";

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

  const { items, fetchMore, refresh } = useFetchItems<
    AlbumObject,
    typeof AlbumsDocument
  >({
    limit,
    doc: AlbumsDocument,
    variables,
    refreshName: "albums",
  });

  const { changeInput, changeFavorite, changeSort, changeStatus } =
    useVariablesItems({
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
                <IonItem button detail={false} color="dark">
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
                        color="dark"
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
          totalCount={items.length}
          endReached={() => items.length >= limit && fetchMore()}
          itemContent={(index) => <AlbumItem album={items[index]} />}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

export const AlbumItem = ({ album }: { album: AlbumObject }) => {
  return (
    <IonItem button detail={false} routerLink={`/albums/${album.id}`}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <img src={convertImageUrl({ url: album.artworkM?.url, px: 110 })} />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{album.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="albumIds" id={album.id} size="s" />
      </IonButtons>
    </IonItem>
  );
};
