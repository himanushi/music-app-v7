import { IonList, IonItem, IonLabel } from "@ionic/react";
import { LogoIcon } from "~/components/LogoIcon";
import { useStartedServiceState } from "~/hooks";
import { mergeMeta } from "~/lib";
import { appleMusicAccountService } from "~/machines";
import { Capacitor } from "@capacitor/core";
import { ReactNode } from "react";
import { Icon } from "~/components";

export const AppleMusicAccount = () => {
  useStartedServiceState(appleMusicAccountService);

  const onClick = () => {
    appleMusicAccountService.send("LOGIN_OR_LOGOUT");
  };

  const label = mergeMeta(appleMusicAccountService.getSnapshot().meta)?.label;

  return (
    <IonList>
      <IonItem button onClick={onClick} lines="none">
        <LogoIcon name="apple-music" slot="start" />
        <IonLabel>Apple Music {label}</IonLabel>
      </IonItem>
      <Info />
    </IonList>
  );
};

const Info = () => {
  const service = appleMusicAccountService.getSnapshot();

  const contents: ReactNode[] = [];
  if (service.matches("authorized") && Capacitor.getPlatform() === "ios") {
    contents.push(
      "ログアウトする場合は設定で<strong>メディアと Apple Music</strong>を無効にしてください。"
    );
  }
  if (service.matches("authorized")) {
    contents.push(
      "Apple Music からログアウトした場合は30秒の試聴再生となります。"
    );
  }
  if (service.matches("unauthorized") && Capacitor.getPlatform() === "ios") {
    contents.push(
      "ログインする場合は設定で<strong>メディアと Apple Music</strong>を有効にしてください。"
    );
  }
  if (service.matches("unauthorized")) {
    contents.push(
      "Apple Music にログインすると、フル再生やプレイリスト追加などが出来るようになります。ログインしない場合は30秒の試聴再生となります。"
    );
  }

  return (
    <IonItem>
      <Icon color="blue" name="info" slot="start" />
      <IonLabel class="ion-text-wrap">{contents}</IonLabel>
    </IonItem>
  );
};
