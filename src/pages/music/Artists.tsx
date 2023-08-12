import {
  IonAvatar,
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, Page, Refresher, SquareImage } from "~/components";
import {
  ArtistObject,
  ArtistsDocument,
  ArtistsQueryVariables,
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
  ["名前昇順", "NAME.ASC"],
  ["名前降順", "NAME.DESC"],
  ["追加日新しい順", "NEW.DESC"],
  ["追加日古い順", "NEW.ASC"],
  ["人気順", "POPULARITY.DESC"],
];

const statusOptions: [string, StatusEnum][] = [
  ["有効のみ表示", "ACTIVE"],
  ["保留のみ表示", "PENDING"],
  ["除外のみ表示", "IGNORE"],
];

export const Artists = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const { isAllowed } = useMe();

  const [variables, setNestedState] = useNestedState<ArtistsQueryVariables>({
    conditions: {},
    cursor: { limit, offset: 0 },
    sort: { order: "NAME", direction: "ASC" },
  });

  const { items, fetchMore, refresh } = useFetchItems<
    ArtistObject,
    typeof ArtistsDocument
  >({
    limit,
    doc: ArtistsDocument,
    variables,
    refreshName: "artists",
  });

  const { changeInput, changeFavorite, changeSort, changeStatus } =
    useVariablesItems({
      scrollElement,
      setNestedState,
    });

  return (
    <Page>
      <IonHeader translucent className="ion-no-border">
        <IonToolbar>
          <IonTitle>アーティスト</IonTitle>
          <IonButtons slot="start">
            <IonButton id="artist-filter-button" color="main">
              フィルター
            </IonButton>
            <IonPopover
              arrow={false}
              trigger="artist-filter-button"
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
                {isAllowed("changeArtistStatus") && (
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
            <IonButton id="artist-sort-button" color="main">
              並び替え
            </IonButton>
            <IonPopover
              arrow={false}
              trigger="artist-sort-button"
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
            placeholder="アーティストで検索"
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
          itemContent={(index) => <ArtistItem artist={items[index]} />}
        />
      </IonContent>
    </Page>
  );
};

export const ArtistItem = ({ artist }: { artist: ArtistObject }) => {
  return (
    <IonItem button detail={false} routerLink={`/artists/${artist.id}`}>
      <IonAvatar slot="start" style={{ height: "50px", width: "50px" }}>
        <SquareImage
          circle
          key={artist.artworkM?.url}
          src={convertImageUrl({ url: artist.artworkM?.url, px: 50 })}
        />
      </IonAvatar>
      <IonLabel class="ion-text-wrap">{artist.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="artistIds" id={artist.id} size="s" />
      </IonButtons>
    </IonItem>
  );
};
