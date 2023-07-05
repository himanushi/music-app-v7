import {
  IonButton,
  IonButtons,
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
  AlbumsDocument,
  AlbumsQueryVariables,
  AlbumsSortInputObject,
} from "~/graphql/types";
import { useFetchItems, useScrollElement } from "~/hooks";

const limit = 50;

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
  } = useFetchItems({
    limit,
    doc: AlbumsDocument,
    variables,
  });

  const handleInput = useCallback(
    (event: Event) => {
      let query = "";
      const target = event.target as HTMLIonSearchbarElement;
      if (target.value) query = target.value.toLowerCase();
      setVariables({
        ...variables,
        ...{ conditions: query ? { name: query } : {} },
      });
      resetOffset();
      scrollElement?.scrollTo({ top: 0 });
    },
    [resetOffset, scrollElement, variables]
  );

  const handleSort = useCallback(
    (sort: string) => {
      const [order, direction] = sort.split(".");
      setVariables({
        ...variables,
        ...({ sort: { order, direction } } as AlbumsSortInputObject),
      });
      resetOffset();
      scrollElement?.scrollTo({ top: 0 });
    },
    [resetOffset, scrollElement, variables]
  );

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
        <IonToolbar>
          <IonTitle>アルバム</IonTitle>
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
                <IonItem
                  button
                  detail={false}
                  onClick={() => handleSort("RELEASE.DESC")}
                >
                  配信日新しい順
                </IonItem>
                <IonItem
                  button
                  detail={false}
                  onClick={() => handleSort("RELEASE.ASC")}
                >
                  配信日古い順
                </IonItem>
                <IonItem
                  button
                  detail={false}
                  onClick={() => handleSort("NEW.DESC")}
                >
                  追加日新しい順
                </IonItem>
                <IonItem
                  button
                  detail={false}
                  onClick={() => handleSort("NEW.ASC")}
                >
                  追加日古い順
                </IonItem>
                <IonItem
                  button
                  detail={false}
                  onClick={() => handleSort("POPULARITY.DESC")}
                >
                  人気順
                </IonItem>
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
