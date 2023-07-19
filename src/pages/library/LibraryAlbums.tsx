import { Capacitor } from "@capacitor/core";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, FooterPadding } from "~/components";
import { LibraryAlbumsDocument } from "~/graphql/client";
import { useFetchLibraryItems, useMusicKit, useScrollElement } from "~/hooks";
import { convertImageUrl } from "~/lib";

const limit = 50;

export const LibraryAlbums = () => {
  const { contentRef, scrollElement } = useScrollElement();
  const { isAuthorized } = useMusicKit();
  const { items, fetchMore } = useFetchLibraryItems<
    MusicKit.LibraryAlbums,
    any
  >({
    doc: LibraryAlbumsDocument,
    limit,
    variables: { limit, offset: 0 },
    skip: !isAuthorized,
  });

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
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <Virtuoso
          useWindowScroll
          customScrollParent={scrollElement}
          totalCount={items.length}
          endReached={() => items.length >= limit && fetchMore()}
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
    <IonItem button detail={false} routerLink={`/library-albums/${album.id}`}>
      <IonThumbnail slot="start" style={{ height: "110px", width: "110px" }}>
        <img
          src={convertImageUrl({ url: album.attributes.artwork?.url, px: 200 })}
        />
      </IonThumbnail>
      <IonLabel class="ion-text-wrap">{album.attributes.name}</IonLabel>
      <IonButtons slot="end">
        <FavoriteButton type="albumIds" id={album.id} size="s" />
      </IonButtons>
    </IonItem>
  );
};
