import { Capacitor } from "@capacitor/core";
import {
  IonButton,
  IonButtons,
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
  useIonToast,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Page, Refresher, SquareImage } from "~/components";
import { LibraryAlbumsDocument } from "~/graphql/appleMusicClient";
import { useFetchLibraryItems, useMusicKit, useScrollElement } from "~/hooks";
import { convertImageUrl } from "~/lib";

const sortOptions = [
  { field: "name", order: "asc", label: "名前昇順" },
  { field: "name", order: "desc", label: "名前降順" },
  { field: "dateAdded", order: "desc", label: "追加日新しい順" },
  { field: "dateAdded", order: "asc", label: "追加日古い順" },
  { field: "trackCount", order: "asc", label: "曲数昇順" },
  { field: "trackCount", order: "desc", label: "曲数降順" },
] as const;

const limit = 50;

export const LibraryAlbums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const { isAuthorized } = useMusicKit();
  const [albums, setAlbums] = useState<MusicKit.LibraryAlbums[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [sortField, setSortField] = useState<
    "name" | "dateAdded" | "trackCount"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { items, fetchMore, refresh, meta } = useFetchLibraryItems<
    MusicKit.LibraryAlbums,
    any
  >({
    doc: LibraryAlbumsDocument,
    limit,
    variables: { limit, offset: 0 },
    skip: !isAuthorized,
    refreshId: "LibraryAlbums:{}",
  });

  const [open, close] = useIonToast();

  useEffect(() => {
    if (!isAuthorized) return;
    if (meta.total > 0 && meta.total > items.length) {
      fetchMore();
      open({
        message: `ライブラリアルバム同期中...`,
        position: "bottom",
        color: "main",
      });
    } else {
      close();
    }
  }, [meta.total, items.length, fetchMore, isAuthorized, open, close]);

  useEffect(() => {
    if (items.length > 0) {
      let filteredAlbums = [...items];

      if (nameFilter) {
        filteredAlbums = filteredAlbums.filter((album) =>
          album.attributes.name.toLowerCase().includes(nameFilter)
        );
      }

      filteredAlbums.sort((a, b) => {
        const aValue = a.attributes?.[sortField];
        const bValue = b.attributes?.[sortField];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? (aValue as string).localeCompare(bValue as string)
            : (bValue as string).localeCompare(aValue as string);
        } else {
          return 0;
        }
      });

      setAlbums(filteredAlbums);
    }
  }, [items, nameFilter, sortField, sortOrder]);

  const changeInput = useCallback(
    (event: Event) => {
      scrollElement?.scrollTo({ top: 0 });
      const target = event.target as HTMLIonSearchbarElement;
      setNameFilter(target.value ? target.value.toLowerCase() : "");
    },
    [scrollElement]
  );

  const changeSort = useCallback(
    (
      newSortField: "name" | "dateAdded" | "trackCount",
      newSortOrder: "asc" | "desc"
    ) => {
      setSortField(newSortField);
      setSortOrder(newSortOrder);
    },
    []
  );

  return (
    <Page>
      <IonHeader translucent className="ion-no-border">
        <IonToolbar>
          <IonTitle>ライブラリアルバム</IonTitle>
          <IonButtons slot="end">
            <IonButton id="library-album-sort-button" color="red">
              並び替え
            </IonButton>
            <IonPopover
              arrow={false}
              trigger="library-album-sort-button"
              side="bottom"
              alignment="start"
              dismissOnSelect={true}
            >
              <IonList>
                {sortOptions.map((option) => (
                  <IonItem
                    key={`${option.field}-${option.order}`}
                    button
                    detail={false}
                    color="dark"
                    onClick={() => changeSort(option.field, option.order)}
                  >
                    {option.label}
                  </IonItem>
                ))}
              </IonList>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            placeholder="アルバムで検索"
            onIonInput={(ev) => changeInput(ev)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Refresher refresh={refresh} />
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          totalCount={albums.length}
          itemContent={(index) => <LibraryAlbumItem album={albums[index]} />}
        />
      </IonContent>
    </Page>
  );
};

export const LibraryAlbumItem = ({
  album,
}: {
  album: MusicKit.LibraryAlbums;
}) => {
  return (
    <IonItem button detail={false} routerLink={`/library-albums/${album.id}`}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <SquareImage
          key={album.attributes.artwork?.url}
          src={convertImageUrl({ url: album.attributes.artwork?.url, px: 200 })}
        />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{album.attributes.name}</IonLabel>
    </IonItem>
  );
};
