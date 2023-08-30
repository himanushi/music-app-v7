import { useMutation } from "@apollo/client";
import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon, Page } from "~/components";
import { LoginDocument, MeDocument } from "~/graphql/types";
import { useErrorMessages } from "~/hooks";

export const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [login, { data, error }] = useMutation(LoginDocument, {
    refetchQueries: [{ query: MeDocument }],
  });
  const { errorMessages } = useErrorMessages(error);
  const [present, dismiss] = useIonToast();

  // login success
  useEffect(() => {
    if (data?.login) {
      history.push("/settings");
      (async () => {
        await dismiss();
        await present({
          message: "ログインしました",
          duration: 2000,
          position: "top",
          color: "main",
        });
      })();
    }
  }, [data?.login, dismiss, errorMessages, history, present]);

  // login error
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
    <Page>
      <IonHeader>
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle style={{ paddingBottom: "0px" }} size="large">
              ログイン
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonInput
              label="ユーザーID"
              labelPlacement="stacked"
              type="email"
              onIonInput={(e) => setUsername(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="パスワード"
              labelPlacement="stacked"
              type="password"
              onIonInput={(e) => setCurrentPassword(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem
            button
            onClick={() =>
              login({ variables: { input: { username, currentPassword } } })
            }
          >
            <Icon name="login" slot="start" color="blue" />
            <IonLabel>ログイン</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </Page>
  );
};
