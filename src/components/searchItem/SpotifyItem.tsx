import { Capacitor } from "@capacitor/core";
import { IonItem, IonLabel } from "@ionic/react";

export const SpotifyItem = ({ name }: { name: string }) => {
  let href = `https://open.spotify.com/search/${name}`;
  if (Capacitor.isNativePlatform())
    href = `https://open.spotify.com/search/results/${name}`;

  return (
    <IonItem color="dark" target="_blank" detail={false} href={href}>
      <IonLabel>Spotify で検索</IonLabel>
    </IonItem>
  );
};
