import { useMutation } from "@apollo/client";
import {
  IonCard,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { Icon, Page } from "~/components";
import {
  ChangePasswordDocument,
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
    <IonCard>
      <IonItem button routerLink="/login" color="dark-gray">
        <Icon name="login" slot="start" color="blue" />
        <IonLabel>ログイン</IonLabel>
      </IonItem>
      <IonItem button routerLink="/signup" color="dark-gray">
        <Icon name="person_add" slot="start" color="green" />
        <IonLabel>登録する</IonLabel>
      </IonItem>
    </IonCard>
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
    <IonCard>
      <IonItem color="dark-gray">
        <IonLabel>ユーザーID</IonLabel>
        <IonLabel slot="end">{me.username}</IonLabel>
      </IonItem>
      <IonItem color="dark-gray">
        <IonLabel>名前</IonLabel>
        <IonLabel slot="end">{me.name}</IonLabel>
      </IonItem>
      <IonItem color="dark-gray">
        <IonLabel>権限</IonLabel>
        <IonNote slot="end">{me.role.description}</IonNote>
      </IonItem>
      <IonItem button onClick={() => router.push("/me/edit")} color="dark-gray">
        <Icon name="edit" slot="start" color="green" size="s" />
        <IonLabel>設定変更</IonLabel>
      </IonItem>
      <IonItem button onClick={onClick} color="dark-gray">
        <Icon name="logout" slot="start" color="red" size="s" />
        <IonLabel>ログアウト</IonLabel>
      </IonItem>
    </IonCard>
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
        <UpdatePassword />
      </IonContent>
    </Page>
  );
};

const UpdateName = () => {
  const [name, setName] = useState("");
  const [update, { error }] = useMutation(UpdateMeDocument, {
    refetchQueries: [{ query: MeDocument }],
  });
  const { errorMessages } = useErrorMessages(error);
  const [present, dismiss] = useIonToast();
  const { me } = useMe();
  const router = useIonRouter();

  useEffect(() => {
    if (me) setName(me.name);
  }, [me]);

  const updateName = useCallback(async () => {
    await dismiss();
    await update({ variables: { input: { name } } });
    router.push("/settings");
    await present({
      message: "変更しました",
      duration: 2000,
      position: "top",
      color: "main",
    });
  }, [update, name, dismiss, router, present]);

  useEffect(() => {
    if (errorMessages && errorMessages["_"]) {
      (async () => {
        await dismiss();
        await present({
          message: errorMessages["_"],
          duration: 5000,
          position: "top",
          color: "red",
        });
      })();
    }
  }, [dismiss, errorMessages, present]);

  return (
    <IonCard>
      <IonItem color="dark">
        <IonInput
          label="名前"
          labelPlacement="stacked"
          onIonInput={(e) => setName(e.detail.value!)}
          value={name}
        ></IonInput>
      </IonItem>
      <IonItem button onClick={updateName} color="dark">
        <Icon name="edit" slot="start" color="blue" size="s" />
        <IonLabel>変更</IonLabel>
      </IonItem>
    </IonCard>
  );
};

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [update, { error }] = useMutation(ChangePasswordDocument);
  const { errorMessages } = useErrorMessages(error);
  const [present, dismiss] = useIonToast();
  const router = useIonRouter();

  const updateName = useCallback(async () => {
    await dismiss();
    await update({
      variables: {
        input: { currentPassword, newPassword, newPasswordConfirmation },
      },
    });
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
    router.push("/settings");
    await present({
      message: "変更しました",
      duration: 2000,
      position: "top",
      color: "main",
    });
  }, [
    update,
    currentPassword,
    newPassword,
    newPasswordConfirmation,
    dismiss,
    router,
    present,
  ]);

  return (
    <IonCard>
      <IonItem color="dark">
        <IonInput
          label="現在のパスワード"
          labelPlacement="stacked"
          onIonInput={(e) => setCurrentPassword(e.detail.value!)}
          value={currentPassword}
          className={
            errorMessages?.currentPassword ? "ion-invalid ion-touched" : ""
          }
          errorText={errorMessages?.currentPassword}
        ></IonInput>
      </IonItem>
      <IonItem color="dark">
        <IonInput
          label="新しいパスワード"
          labelPlacement="stacked"
          onIonInput={(e) => setNewPassword(e.detail.value!)}
          value={newPassword}
          className={
            errorMessages?.newPassword ? "ion-invalid ion-touched" : ""
          }
          errorText={errorMessages?.newPassword}
        ></IonInput>
      </IonItem>
      <IonItem color="dark">
        <IonInput
          label="新しいパスワードの再確認"
          labelPlacement="stacked"
          onIonInput={(e) => setNewPasswordConfirmation(e.detail.value!)}
          value={newPasswordConfirmation}
          className={errorMessages?._ ? "ion-invalid ion-touched" : ""}
          errorText={errorMessages?._}
        ></IonInput>
      </IonItem>
      <IonItem button onClick={updateName} color="dark">
        <Icon name="edit" slot="start" color="blue" size="s" />
        <IonLabel>変更</IonLabel>
      </IonItem>
    </IonCard>
  );
};
