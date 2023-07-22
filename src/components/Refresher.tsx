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
    <IonRefresher
      slot="fixed"
      style={{ zIndex: 1 }} // https://github.com/ionic-team/ionic-framework/issues/18714#issuecomment-913305864
      onIonRefresh={refresh}
    >
      <IonRefresherContent pullingIcon="lines" />
    </IonRefresher>
  );
};
