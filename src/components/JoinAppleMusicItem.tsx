import { IonItem, IonLabel } from "@ionic/react";
import { LogoIcon } from "./LogoIcon";
import { Capacitor } from "@capacitor/core";
import { appleAffiliateToken } from "~/lib/variable";
import { Icon } from ".";

export const JoinAppleMusicItem = () => {
  let token = "";
  if (appleAffiliateToken) {
    token = `&at=${appleAffiliateToken}`;
  }

  let href = `https://music.apple.com/jp/browse?app=music&p=subscribe${token}`;
  if (Capacitor.getPlatform() === "web") {
    href = `https://music.apple.com/jp/browse?app=music&p=subscribe${token}`;
  } else if (Capacitor.getPlatform() === "ios") {
    href = `musics://music.apple.com/deeplink?app=music&p=subscribe${token}`;
  } else if (Capacitor.getPlatform() === "android") {
    href = `https://music.apple.com/deeplink?app=music&p=subscribe${token}`;
  } else if (/Mac|Win/iu.test(navigator.platform)) {
    href = `itmss://music.apple.com/deeplink?app=music&p=subscribe${token}`;
  }

  return (
    <>
      <IonItem button href={href} lines="none">
        <LogoIcon name="apple-music" size="s" slot="start" />
        <IonLabel>Apple Music に加入する</IonLabel>
      </IonItem>
      <IonItem lines="none">
        <Icon name="info" slot="start" color="blue" />
        <IonLabel className="ion-text-wrap">
          Apple Music
          に加入すると、ライブラリの曲を再生できるようになります。Voice
          プランは対象外です。
        </IonLabel>
      </IonItem>
    </>
  );
};
