import { IonList, IonItem, IonLabel } from "@ionic/react";
import { LogoIcon } from "~/components/LogoIcon";
import { useStartedServiceState } from "~/hooks";
import { mergeMeta } from "~/lib";
import { appleMusicAccountService } from "~/machines";

export const AppleMusicAccount = () => {
  useStartedServiceState(appleMusicAccountService);

  const onClick = () => {
    appleMusicAccountService.send("LOGIN_OR_LOGOUT");
  };

  const label = mergeMeta(appleMusicAccountService.getSnapshot().meta)?.label;

  return (
    <IonList>
      <IonItem button onClick={onClick}>
        <LogoIcon name="apple-music" slot="start" />
        <IonLabel>Apple Music {label}</IonLabel>
      </IonItem>
    </IonList>
  );
};
