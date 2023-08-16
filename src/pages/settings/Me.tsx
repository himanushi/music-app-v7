import { useMutation } from "@apollo/client";
import { IonItem, IonLabel, IonList, IonNote, useIonToast } from "@ionic/react";
import { Icon } from "~/components";
import { CurrentUserObject, LogoutDocument, MeDocument } from "~/graphql/types";
import { useMe } from "~/hooks";

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
      <IonItem button onClick={onClick}>
        <Icon name="logout" slot="start" color="red" />
        <IonLabel>ログアウト</IonLabel>
      </IonItem>
    </IonList>
  );
};
