import {
  CheckboxChangeEventDetail,
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
import { useCallback } from "react";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, FooterPadding, Icon } from "~/components";
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
} from "~/hooks";

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
  } = useFetchItems<AlbumObject>({
    limit,
    doc: AlbumsDocument,
    variables,
  });

  const reset = useCallback(() => {
    resetOffset();
    scrollElement?.scrollTo({ top: 0 });
  }, [resetOffset, scrollElement]);

  const handleInput = useCallback(
    (event: Event) => {
      reset();
      const target = event.target as HTMLIonSearchbarElement;
      const query = target.value ? target.value.toLowerCase() : "";
      setNestedState("conditions", "name", query ? query : undefined);
    },
    [reset, setNestedState]
  );

  const handleSort = useCallback(
    (sort: string) => {
      reset();
      const [order, direction] = sort.split(".");
      setNestedState("sort", "order", order);
      setNestedState("sort", "direction", direction);
    },
    [reset, setNestedState]
  );

  const handleChangeFavorite = useCallback(
    (event: CustomEvent<CheckboxChangeEventDetail>) => {
      reset();
      setNestedState("conditions", "favorite", event.detail.checked);
    },
    [reset, setNestedState]
  );

  const handleChangeStatus = useCallback(
    (status: string) => {
      reset();
      setNestedState("conditions", "status", status);
    },
    [reset, setNestedState]
  );

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
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
                    onIonChange={handleChangeFavorite}
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
                        onClick={() => handleChangeStatus(status[1])}
                      >
                        <IonCheckbox
                          color="main"
                          checked={
                            variables.conditions?.status?.includes(status[1]) ||
                            (status[1] === "ACTIVE" &&
                              variables.conditions?.status === undefined)
                          }
                          onIonChange={handleChangeFavorite}
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
                    onClick={() => handleSort(sort[1])}
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
            onIonInput={(ev) => handleInput(ev)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Virtuoso
          key={albums[0]?.id}
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "100%" }}
          totalCount={albums.length}
          endReached={() => albums.length >= limit && fetchMore()}
          itemContent={(index) => (
            <IonItem
              button
              detail={false}
              routerLink={`/albums/${albums[index].id}`}
            >
              <IonThumbnail
                slot="start"
                style={{ height: "110px", width: "110px" }}
              >
                <img src={albums[index].artworkM?.url} />
              </IonThumbnail>
              <IonLabel class="ion-text-wrap">{albums[index].name}</IonLabel>
              <IonButtons slot="end">
                <FavoriteButton
                  type="albumIds"
                  id={albums[index].id}
                  size="s"
                />
                <IonButton>
                  <Icon size="m" slot="icon-only" name="more_horiz" />
                </IonButton>
              </IonButtons>
            </IonItem>
          )}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};
