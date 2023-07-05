import { useMutation, useQuery } from "@apollo/client";
import { IonItem, IonLabel, IonList, IonNote } from "@ionic/react";
import { Icon } from "~/components";
import { CurrentUserObject, LogoutDocument, MeDocument } from "~/graphql/types";

export const Me = () => {
  const { data } = useQuery(MeDocument);
  const me = data?.me;

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
      <IonItem button onClick={() => logout({ variables: { input: {} } })}>
        <Icon name="logout" slot="start" color="red" />
        <IonLabel>ログアウト</IonLabel>
      </IonItem>
    </IonList>
  );
};
