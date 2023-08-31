import { IonItem, IonLabel } from "@ionic/react";

export const YoutubeMusicItem = ({ name }: { name: string }) => {
  const href = `https://music.youtube.com/search?q=${name}`;

  return (
    <IonItem color="dark" target="_blank" detail={false} href={href}>
      <IonLabel>Youtube Music で検索</IonLabel>
    </IonItem>
  );
};
