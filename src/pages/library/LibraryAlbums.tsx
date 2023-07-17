import { gql, useQuery, useReactiveVar } from "@apollo/client";
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
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, FooterPadding, Refresher } from "~/components";
import { appleMusicClient } from "~/graphql/appleMusicClient";
import { LibraryAlbumsDocument } from "~/graphql/client";
import {
  AlbumObject,
  AlbumsDocument,
  AlbumsQueryVariables,
  StatusEnum,
} from "~/graphql/types";
import {
  useFetchItems,
  useFetchLibraryItems,
  useMe,
  useMusicKit,
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

export const LibraryAlbums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const { isAuthorized } = useMusicKit();
  const { items, fetchMore } = useFetchLibraryItems({
    doc: LibraryAlbumsDocument,
    limit: 50,
    variables: { limit: 50, offset: 0 },
    skip: !isAuthorized,
  });
  console.log("items", items);

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
        {Capacitor.isNativePlatform() && <IonToolbar />}
        <IonToolbar>
          <IonTitle>ライブラリアルバム</IonTitle>
          <IonButtons slot="start">
            <IonButton id="library-album-filter-button" color="red">
              フィルター
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton id="album-sort-button" color="red">
              並び替え
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          {/* <IonSearchbar
            placeholder="アルバムで検索"
            debounce={2000}
            onIonInput={(ev) => changeInput(ev)}
          ></IonSearchbar> */}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          totalCount={items.length}
          endReached={() =>
            items.length >= limit && fetchMore({ offset: 50, limit: 50 })
          }
          itemContent={(index) => <LibraryAlbumItem album={items[index]} />}
        />
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

export const LibraryAlbumItem = ({
  album,
}: {
  album: MusicKit.LibraryAlbums;
}) => {
  return (
    <IonItem button detail={false} routerLink={`/albums/${album.id}`}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <img
          src={convertImageUrl({ url: album.attributes.artwork?.url, px: 110 })}
        />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{album.attributes.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="albumIds" id={album.id} size="s" />
      </IonButtons>
    </IonItem>
  );
};
