import { ApolloError, useMutation } from "@apollo/client";
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  useIonToast,
  IonTitle,
  useIonActionSheet,
  useIonLoading,
  useIonAlert,
  IonAlert,
  useIonRouter,
} from "@ionic/react";
import { useRef, useState } from "react";
import { Icon, Page } from "~/components";
import {
  AddAlbumDocument,
  AddAlbumInput,
  ClearCacheDocument,
  IgnoreAlbumsDocument,
  IgnoreArtistsDocument,
} from "~/graphql/types";
import { buildErrorMessages } from "~/hooks";

export const Console = () => {
  return (
    <Page>
      <IonHeader class="ion-no-border">
        <IonToolbar>
          <IonTitle>コンソール</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <AddAlbumItem />
        <ClearCacheItem />
        <AllIgnoresItem />
        <IonItem button routerLink="/roles">
          <Icon name="key" slot="start" color="blue" />
          権限
        </IonItem>
      </IonContent>
    </Page>
  );
};

const AddAlbumItem = () => {
  const [add] = useMutation(AddAlbumDocument);
  const [toast] = useIonToast();
  const [loading, loaded] = useIonLoading();
  const [isOpen, setIsOpen] = useState(false);
  const router = useIonRouter();

  return (
    <IonItem button onClick={() => setIsOpen(true)}>
      <Icon name="music_note" slot="start" color="red" />
      アルバム追加
      <IonAlert
        onDidDismiss={() => setIsOpen(false)}
        isOpen={isOpen}
        header="Apple Music ID でアルバムを追加します"
        inputs={[
          {
            name: "appleMusicId",
            placeholder: "Apple Music ID",
            type: "text",
          },
        ]}
        buttons={[
          {
            cssClass: "secondary",
            handler: () => true,
            role: "cancel",
            text: "キャンセル",
          },
          {
            handler: (values: AddAlbumInput) => {
              (async () => {
                try {
                  if (values.appleMusicId && values.appleMusicId !== "") {
                    await loading();

                    const result = await add({
                      variables: { input: values },
                    });

                    if (result.data?.addAlbum?.album) {
                      toast({
                        color: "light-green",
                        duration: 2000,
                        message: "追加しました",
                      });
                      router.push(`/albums/${result.data.addAlbum.album.id}`);
                    } else {
                      toast({
                        color: "light-blue",
                        duration: 5000,
                        message: "一致するアルバムがありませんでした",
                      });
                    }
                  }
                } catch (error) {
                  if (error instanceof ApolloError) {
                    const messages = buildErrorMessages(error);

                    toast({
                      color: "light-red",
                      message: `エラーが発生しました。[${messages._}]`,
                      duration: 10000,
                    });
                  }
                } finally {
                  await loaded();
                }
              })();
            },
            text: "追加",
          },
        ]}
      />
    </IonItem>
  );
};

const ClearCacheItem = () => {
  const [open] = useIonActionSheet();
  const [clear] = useMutation(ClearCacheDocument);
  const [toast] = useIonToast();

  return (
    <IonItem
      button
      onClick={() =>
        open({
          buttons: [
            {
              text: "キャッシュクリア",
              role: "destructive",
              data: {
                action: "CLEAR",
              },
            },
            {
              text: "キャンセル",
              role: "cancel",
              data: {
                action: "CANCEL",
              },
            },
          ],
          onDidDismiss: async ({ detail }) => {
            if (!["CLEAR"].includes(detail.data?.action)) return;
            await clear({
              variables: { input: {} },
            });
            await toast({
              message: "キャッシュをクリアしました",
              duration: 2000,
              position: "top",
            });
          },
        })
      }
    >
      <Icon name="delete" slot="start" color="red" />
      キャッシュクリア
    </IonItem>
  );
};

const AllIgnoresItem = () => {
  const [loading, loaded] = useIonLoading();
  const [open] = useIonActionSheet();
  const [ignoreArtists] = useMutation(IgnoreArtistsDocument);
  const [ignoreAlbums] = useMutation(IgnoreAlbumsDocument);
  const [toast] = useIonToast();

  return (
    <IonItem
      button
      onClick={() =>
        open({
          buttons: [
            {
              text: "除外する",
              role: "destructive",
              data: {
                action: "CLEAR",
              },
            },
            {
              text: "キャンセル",
              role: "cancel",
              data: {
                action: "CANCEL",
              },
            },
          ],
          onDidDismiss: async ({ detail }) => {
            if (!["CLEAR"].includes(detail.data?.action)) return;
            await loading();
            await ignoreArtists({ variables: { input: {} } });
            await ignoreAlbums({ variables: { input: {} } });
            await loaded();
            await toast({
              message: "除外しました",
              duration: 2000,
              position: "top",
            });
          },
        })
      }
    >
      <Icon name="info" slot="start" color="red" />
      アーティストとアルバムの保留を全て除外する
    </IonItem>
  );
};
