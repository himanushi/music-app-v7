import { IonLabel } from "@ionic/react";
import { appleAffiliateToken } from "~/lib/variable";
import { Icon } from "..";
import { ActionButton } from "../ActionButton";

export const AppleMusicPlayButton = ({
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
      <ActionButton color="red" style={{ fontWeight: "700" }} target="_blank" expand="block"
        href={`https://music.apple.com/jp/album/${appleMusicId}?app=music${token}`} >
        <Icon name="music_note" size="s" slot="start" color="white" />
        <IonLabel color="white">Apple Music で再生</IonLabel>
      </ActionButton>
    );
  }

  return <ItunesPlayButton appleMusicId={appleMusicId} token={token} />;
};

const ItunesPlayButton = ({
  appleMusicId,
  token,
}: {
  appleMusicId: string;
  token: string;
}) => {
  return (
    <ActionButton color="itunes" style={{ fontWeight: "700" }} target="_blank" expand="block"
      href={`itmss://music.apple.com/jp/album/${appleMusicId}?app=itunes${token}`} >
      <Icon name="music_note" size="s" slot="start" color="white" />
      <IonLabel color="white">iTunes で再生</IonLabel>
    </ActionButton>
  );
};
