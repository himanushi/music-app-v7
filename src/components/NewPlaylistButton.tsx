import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { Icon } from ".";
import { buildErrorMessages, useNewPlaylist } from "~/hooks";
import { useMutation } from "@apollo/client";
import { PlaylistsDocument, UpsertPlaylistDocument } from "~/graphql/types";
import { useCallback, useState } from "react";

export const NewPlaylistButton = ({
  trackIds = [],
}: {
  trackIds?: string[];
}) => {
  const { open } = useNewPlaylist({ trackIds: trackIds });

  return (
    <IonItem onClick={open}>
      <IonButtons slot="start">
        <IonButton style={{ height: "110px", width: "110px" }}>
          <Icon name="add_circle" slot="icon-only" size={60} color="main" />
        </IonButton>
      </IonButtons>
      <IonLabel color="main">新規プレイリストを追加</IonLabel>
    </IonItem>
  );
};

export const NewPlaylistModal = ({
  onDismiss,
  trackIds,
}: {
  onDismiss: () => void;
  trackIds: string[];
}) => {
  const [upsert] = useMutation(UpsertPlaylistDocument, {
    refetchQueries: [PlaylistsDocument],
  });
  const [loading, loaded] = useIonLoading();
  const [toast] = useIonToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publicType, setPublicType] = useState<"OPEN" | "NON_OPEN">("NON_OPEN");

  const onClick = useCallback(async () => {
    await loading();
    try {
      await upsert({
        variables: {
          input: {
            name,
            description,
            publicType,
            trackIds,
          },
        },
      });
      await loaded();
      onDismiss();
      toast({
        message: "プレイリストを作成しました",
        color: "main",
        duration: 3000,
      });
    } catch (e: any) {
      await loaded();
      const errorMessages = buildErrorMessages(e);
      toast({
        message: Object.keys(errorMessages)
          .map((key) => errorMessages[key])
          .join(""),
        color: "danger",
        duration: 3000,
      });
    }
  }, [
    description,
    loaded,
    loading,
    name,
    onDismiss,
    publicType,
    toast,
    trackIds,
    upsert,
  ]);

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar color="dark-gray">
          <IonButtons slot="start">
            <IonButton onClick={() => onDismiss()} color="main">
              キャンセル
            </IonButton>
          </IonButtons>
          <IonTitle>新規プレイリスト</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClick} color="main">
              完了
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        color="dark-gray"
        forceOverscroll={false}
      >
        <IonItem color="dark-gray">
          <IonInput
            onIonInput={(e) => setName(e.detail.value!)}
            label="タイトル"
            labelPlacement="floating"
            counter={true}
            maxlength={100}
            counterFormatter={(inputLength, maxLength) =>
              `残り ${maxLength - inputLength}文字`
            }
          />
        </IonItem>
        <IonItem color="dark-gray">
          <IonInput
            onIonInput={(e) => setDescription(e.detail.value!)}
            label="説明"
            labelPlacement="floating"
            counter={true}
            maxlength={500}
            counterFormatter={(inputLength, maxLength) =>
              `残り ${maxLength - inputLength}文字`
            }
          />
        </IonItem>
        <IonItem color="dark-gray">
          <IonCheckbox
            onIonChange={(e) =>
              setPublicType(e.detail.checked ? "OPEN" : "NON_OPEN")
            }
            slot="start"
            color="main"
            labelPlacement="end"
          >
            公開する
          </IonCheckbox>
        </IonItem>
        <IonItem color="dark-gray">
          <Icon name="info" color="blue" slot="start" />
          <IonLabel className="ion-text-wrap">
            共有プレイリストに表示されます
          </IonLabel>
        </IonItem>
      </IonContent>
    </>
  );
};
