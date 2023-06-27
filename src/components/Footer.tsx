import {
  IonButton,
  IonButtons,
  IonFooter,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Icon } from ".";
import { useHistory } from "react-router-dom";

export const Footer = () => {
  const history = useHistory();

  return (
    <IonFooter>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={() => history.goBack()}>
            <Icon name="chevron_left" color="primary" slot="icon-only" />
          </IonButton>
        </IonButtons>
        <IonTitle>Back Button</IonTitle>
      </IonToolbar>
    </IonFooter>
  );
};
