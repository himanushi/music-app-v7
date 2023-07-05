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
import { useCallback, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { FooterPadding, Icon } from "~/components";
import {
  AlbumObject,
  AlbumsDocument,
  AlbumsQueryVariables,
  AlbumsSortInputObject,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";

const limit = 50;

const sortOptions = [
  ["配信日新しい順", "RELEASE.DESC"],
  ["配信日古い順", "RELEASE.ASC"],
  ["追加日新しい順", "NEW.DESC"],
  ["追加日古い順", "NEW.ASC"],
  ["人気順", "POPULARITY.DESC"],
];

export const Albums = () => {
  const { contentRef, scrollElement } = useScrollElement();

  const [variables, setVariables] = useState<AlbumsQueryVariables>({
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

  const handleInput = useCallback(
    (event: Event) => {
      const target = event.target as HTMLIonSearchbarElement;
      const query = target.value ? target.value.toLowerCase() : "";
      setVariables((prevVariables) => ({
        ...prevVariables,
        conditions: query ? { name: query } : {},
      }));
      resetOffset();
      scrollElement?.scrollTo({ top: 0 });
    },
    [resetOffset, scrollElement]
  );

  const handleSort = useCallback(
    (sort: string) => {
      const [order, direction] = sort.split(".");
      setVariables((prevVariables) => ({
        ...prevVariables,
        sort: { order, direction } as AlbumsSortInputObject,
      }));
      resetOffset();
      scrollElement?.scrollTo({ top: 0 });
    },
    [resetOffset, scrollElement]
  );

  const handleChangeCheck = useCallback(
    (event: CustomEvent<CheckboxChangeEventDetail>) => {
      setVariables((prevVariables) => ({
        ...prevVariables,
        conditions: {
          ...prevVariables.conditions,
          favorite: event.detail.checked,
        },
      }));
      resetOffset();
      scrollElement?.scrollTo({ top: 0 });
    },
    [resetOffset, scrollElement]
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
            >
              <IonList>
                <IonItem button detail={false}>
                  <IonCheckbox
                    color="main"
                    checked={!!variables.conditions?.favorite}
                    onIonChange={handleChangeCheck}
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
          useWindowScroll
          customScrollParent={scrollElement}
          style={{ height: "100%" }}
          totalCount={albums.length}
          endReached={() => fetchMore()}
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
                <IonButton>
                  <Icon size="s" color="red" slot="icon-only" name="favorite" />
                </IonButton>
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
