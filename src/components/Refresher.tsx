import {
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";

export const Refresher = ({
  refresh,
}: {
  refresh: (event: CustomEvent<RefresherEventDetail>) => void;
}) => {
  return (
    <IonRefresher slot="fixed" onIonRefresh={refresh}>
      <IonRefresherContent pullingIcon="lines" />
    </IonRefresher>
  );
};
