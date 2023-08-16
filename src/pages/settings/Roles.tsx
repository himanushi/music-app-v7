import { useQuery } from "@apollo/client";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { Page } from "~/components";
import { RolesDocument } from "~/graphql/types";

export const Roles = () => {
  const { data } = useQuery(RolesDocument);
  const roles = data?.roles ?? [];

  return (
    <Page>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ロール</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {roles.map((role) => (
          <IonItem key={role.id} routerLink={`/roles/${role.id}`}>
            {role.description}({role.name})
          </IonItem>
        ))}
      </IonContent>
    </Page>
  );
};

export const Role: React.FC<
  RouteComponentProps<{
    id: string;
  }>
> = ({ match }) => {
  const { data } = useQuery(RolesDocument);
  const roles = data?.roles ?? [];
  const role = roles.find((role) => role.id === match.params.id);

  if (!role) return <></>;

  return (
    <Page>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {role.description}({role.name})
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {role.allowedActions.map((action) => (
          <IonItem key={action}>{action}</IonItem>
        ))}
      </IonContent>
    </Page>
  );
};
