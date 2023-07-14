import { IonItem, IonButtons, IonLabel } from "@ionic/react";
import { LogoIcon } from "../LogoIcon";
import { appleAffiliateToken } from "~/lib/variable";

export const AppleMusicItem = ({
  isAppleMusic,
  appleMusicId,
}: {
  isAppleMusic: boolean;
  appleMusicId: string;
}) => {
  let token = "";
  if (appleAffiliateToken) token = `&at=${appleAffiliateToken}`;

  if (isAppleMusic) {
    return (
      <IonItem
        button
        href={`https://music.apple.com/jp/album/${appleMusicId}?app=music${token}`}
      >
        <IonButtons slot="start">
          <LogoIcon name="apple-music" size="s" />
        </IonButtons>
        <IonLabel color="apple-music">Apple Music で聴く</IonLabel>
      </IonItem>
    );
  }

  return <ItunesItem appleMusicId={appleMusicId} token={token} />;
};

const ItunesItem = ({
  appleMusicId,
  token,
}: {
  appleMusicId: string;
  token: string;
}) => {
  return (
    <IonItem
      button
      href={`itmss://music.apple.com/jp/album/${appleMusicId}?app=itunes${token}`}
    >
      <IonButtons slot="start">
        <LogoIcon name="itunes" size="s" />
      </IonButtons>
      <IonLabel>iTunes で確認</IonLabel>
    </IonItem>
  );
};
