import { IonItem, IonLabel } from "@ionic/react";

export const SpotifyItem = ({ name }: { name: string }) => {
  const href = `https://open.spotify.com/search/${name}`;

  return (
    <IonItem color="dark" target="_blank" detail={false} href={href}>
      <IonLabel>Spotify で検索</IonLabel>
    </IonItem>
  );
};
