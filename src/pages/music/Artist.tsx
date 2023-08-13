import { useMutation, useQuery } from "@apollo/client";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonButtons,
  IonTitle,
  IonButton,
  useIonActionSheet,
  useIonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { FavoriteButton, Icon, Page, SkeletonItems, SquareImage, SwitchTitle } from "~/components";
import {
  AlbumObject,
  AlbumsDocument,
  ArtistDocument,
  ArtistObject,
  ChangeArtistStatusDocument,
} from "~/graphql/types";
import { useFetchItems, useMe, useMenu, useScrollElement } from "~/hooks";
import { convertImageUrl } from "~/lib";
import { AlbumItem } from ".";

export const Artist: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { contentRef, scrollElement } = useScrollElement();

  const { data } = useQuery(ArtistDocument, {
    variables: { id: match.params.id },
    fetchPolicy: "cache-first",
  });

  const artist = data?.artist as ArtistObject | undefined;

  return (
    <Page>
      <IonHeader translucent>
        <IonToolbar>
          {
            artist && (<>
              <IonTitle>{artist.name}</IonTitle>
              <ArtistMenuButtons artist={artist} />
            </>)
          }
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <ArtistInfo artist={artist as ArtistObject} />
        {artist ? (
          <ArtistAlbums artistId={artist.id} scrollElement={scrollElement} />
        ) : (
          <SkeletonItems count={10} />
        )}
      </IonContent>
    </Page>
  );
};

const ArtistInfo = ({ artist }: { artist?: ArtistObject }) => {
  return (
    <>
      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol>
            <SquareImage
              circle
              key={artist?.id}
              src={convertImageUrl({
                px: 300,
                url: artist?.artworkL?.url,
              })}
              maxWidth="300px"
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {artist ? (
        <IonList>
          <IonItem className="ion-text-wrap text-select" lines="none">
            <IonLabel>{artist.name}</IonLabel>
          </IonItem>
          <SwitchTitle />
          {artist.status !== "ACTIVE" && (
            <IonItem color={artist.status === "PENDING" ? "yellow" : "red"}>
              {artist.status}
            </IonItem>
          )}
        </IonList>
      ) : (
        <SkeletonItems count={5} lines="none" />
      )}
    </>
  );
};

const ArtistMenuButtons = ({ artist }: { artist: ArtistObject }) => {
  const { isAllowed } = useMe();

  const { open } = useMenu({
    component: ({ onDismiss }) => (
      <IonContent onClick={() => onDismiss()}>
        <ChangeStatusItem artist={artist} />
      </IonContent>
    ),
  });

  return (
    <IonButtons slot="end">
      <FavoriteButton type="artistIds" id={artist?.id} size="s" />
      {
        isAllowed("changeAlbumStatus") && (
          <IonButton onClick={(event) => open(event)}>
            <Icon name="more_horiz" slot="icon-only" />
          </IonButton>
        )
      }
    </IonButtons>
  );
};

const ChangeStatusItem = ({ artist }: { artist: ArtistObject }) => {
  const [open] = useIonActionSheet();
  const [change] = useMutation(ChangeArtistStatusDocument, {
    refetchQueries: [ArtistDocument],
  });
  const [toast] = useIonToast();

  return <IonItem color="dark-gray" onClick={() => open({
    header: 'Change Status',
    buttons: [{
      text: '有効',
      data: {
        action: 'ACTIVE',
      },
    },
    {
      text: '保留',
      data: {
        action: 'PENDING',
      },
    },
    {
      text: '除外',
      data: {
        action: 'IGNORE',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'CANCEL',
      },
    }],
    onDidDismiss: async ({ detail }) => {
      if (detail.data.action === 'CANCEL') return;
      await change({
        variables: {
          input: {
            id: artist.id,
            status: detail.data.action,
          }
        },
      })
      await toast({
        message: 'ステータスを変更しました',
        duration: 3000,
      })
    }
  })}>
    ステータス変更
  </IonItem >
}

const ArtistAlbums = ({
  artistId,
  scrollElement,
}: {
  artistId: string;
  scrollElement: HTMLElement | undefined;
}) => {
  const { isAllowed } = useMe();
  const limit = 50;
  const { items, fetchMore } = useFetchItems<
    AlbumObject,
    typeof AlbumsDocument
  >({
    limit,
    doc: AlbumsDocument,
    variables: {
      conditions: {
        artistIds: [artistId],
        status: isAllowed("changeArtistStatus") ? ["ACTIVE", "IGNORE", "PENDING"] : ["ACTIVE"]
      },
      cursor: { limit, offset: 0 },
      sort: { order: "RELEASE", direction: "DESC" },
    },
  });

  if (items.length === 0) return <></>;

  return (
    <IonList>
      <IonItem>
        <IonNote>アルバム</IonNote>
      </IonItem>
      <Virtuoso
        useWindowScroll
        customScrollParent={scrollElement}
        totalCount={items.length}
        endReached={() => items.length >= limit && fetchMore()}
        itemContent={(index) => <AlbumItem album={items[index]} />}
      />
    </IonList>
  );
};
