import { useMutation, useQuery } from "@apollo/client";
import {
  CheckboxChangeEventDetail,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Icon, Page } from "~/components";
import {
  ActionEnum,
  AllActionsDocument,
  RolesDocument,
  UpdateRoleDocument,
} from "~/graphql/types";

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
  const id = match.params.id;
  const { data } = useQuery(RolesDocument);
  const roles = data?.roles ?? [];
  const role = roles.find((role) => role.id === id);
  const { data: actionData } = useQuery(AllActionsDocument);
  const actions = actionData?.allActions ?? [];
  const [updateRole] = useMutation(UpdateRoleDocument, {
    refetchQueries: [RolesDocument],
  });
  const [loading, loaded] = useIonLoading();
  const [toast] = useIonToast();

  useEffect(() => {
    if (!role) return;
    setCheckedActions(role.allowedActions.slice());
  }, [role]);

  const [checkedActions, setCheckedActions] = useState<ActionEnum[]>([]);
  const onChecked =
    (action: ActionEnum) =>
    (event: CustomEvent<CheckboxChangeEventDetail<any>>) => {
      if (event.detail.checked) {
        setCheckedActions([...checkedActions, action]);
      } else {
        setCheckedActions(
          checkedActions.filter((checkedAction) => checkedAction !== action)
        );
      }
    };

  const onSave = async () => {
    try {
      await loading();

      await updateRole({
        variables: { input: { allowedActions: checkedActions, roleId: id } },
      });

      toast({
        color: "main",
        duration: 3000,
        message: "更新しました",
      });
    } catch (error) {
      toast({
        color: "light-red",
        message: "エラーが発生しました。",
      });
    } finally {
      await loaded();
    }
  };

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
        {actions.map((action) => (
          <IonItem key={action}>
            <IonCheckbox
              color="main"
              checked={checkedActions.indexOf(action) !== -1}
              onIonChange={onChecked(action)}
            />
            <IonLabel>{action}</IonLabel>
          </IonItem>
        ))}
        <IonItem onClick={onSave}>
          <Icon name="save" color="blue" slot="start" />
          <IonLabel>保存</IonLabel>
        </IonItem>
      </IonContent>
    </Page>
  );
};
