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
    <IonRefresher slot="fixed" onIonRefresh={refresh} style={{ zIndex: 1 }}>
      <IonRefresherContent pullingIcon="lines" />
    </IonRefresher>
  );
};
