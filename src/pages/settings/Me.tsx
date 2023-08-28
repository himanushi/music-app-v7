import { useMutation } from "@apollo/client";
import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon, Page } from "~/components";
import {
  CurrentUserObject,
  LogoutDocument,
  MeDocument,
  UpdateMeDocument,
} from "~/graphql/types";
import { useErrorMessages, useMe } from "~/hooks";

export const Me = () => {
  const { me } = useMe();

  // ログイン済み
  if (me?.registered) return <RegisteredMe me={me} />;

  // 未ログイン
  return (
    <IonList>
      <IonItem button routerLink="/login">
        <Icon name="login" slot="start" color="blue" />
        <IonLabel>ログイン</IonLabel>
      </IonItem>
      <IonItem button routerLink="/signup">
        <Icon name="person_add" slot="start" color="green" />
        <IonLabel>登録する</IonLabel>
      </IonItem>
    </IonList>
  );
};

const RegisteredMe = ({ me }: { me: CurrentUserObject }) => {
  const [logout] = useMutation(LogoutDocument, {
    refetchQueries: [{ query: MeDocument }],
  });
  const [present] = useIonToast();
  const onClick = async () => {
    await logout({ variables: { input: {} } });
    await present({
      message: "ログアウトしました",
      duration: 2000,
      color: "red",
      position: "top",
    });
  };
  const router = useIonRouter();

  return (
    <IonList>
      <IonItem>
        <IonLabel>ユーザーID</IonLabel>
        <IonLabel slot="end">{me.username}</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>名前</IonLabel>
        <IonLabel slot="end">{me.name}</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>権限</IonLabel>
        <IonNote slot="end">{me.role.description}</IonNote>
      </IonItem>
      <IonItem button onClick={() => router.push("/me/edit")}>
        <Icon name="edit" slot="start" color="green" />
        <IonLabel>設定変更</IonLabel>
      </IonItem>
      <IonItem button onClick={onClick}>
        <Icon name="logout" slot="start" color="red" />
        <IonLabel>ログアウト</IonLabel>
      </IonItem>
    </IonList>
  );
};

export const EditMe = () => {
  return (
    <Page>
      <IonHeader>
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle style={{ paddingBottom: "0px" }} size="large">
              設定変更
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <UpdateName />
      </IonContent>
    </Page>
  );
};

const UpdateName = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [update, { data, error }] = useMutation(UpdateMeDocument, {
    refetchQueries: [{ query: MeDocument }],
  });
  const { errorMessages } = useErrorMessages(error);
  const [present, dismiss] = useIonToast();
  const { me } = useMe();
  const router = useIonRouter();

  useEffect(() => {
    if (me) setName(me.name);
  }, [me]);

  useEffect(() => {
    if (data?.updateMe) {
      (async () => {
        await dismiss();
        await present({
          message: "変更しました",
          duration: 2000,
          position: "top",
          color: "main",
        });
        router.push("/settings");
      })();
    }
  }, [data?.updateMe, dismiss, errorMessages, history, present, router]);

  useEffect(() => {
    if (errorMessages && errorMessages["_"]) {
      (async () => {
        await dismiss();
        await present({
          message: errorMessages["_"][0],
          duration: 5000,
          position: "top",
          color: "red",
        });
      })();
    }
  }, [dismiss, errorMessages, present]);

  return (
    <IonList>
      <IonItem>
        <IonInput
          label="名前"
          labelPlacement="stacked"
          onIonInput={(e) => setName(e.detail.value!)}
          value={name}
        ></IonInput>
      </IonItem>
      <IonItem
        button
        onClick={() => update({ variables: { input: { name } } })}
      >
        <Icon name="edit" slot="start" color="blue" />
        <IonLabel>変更</IonLabel>
      </IonItem>
    </IonList>
  );
};
