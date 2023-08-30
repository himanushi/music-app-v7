import { IonItem, IonLabel } from "@ionic/react";

export const AmazonMusicItem = ({ name }: { name: string }) => {
  const href = `https://amazon.co.jp/s?i=digital-music&k=${name}`;

  return (
    <IonItem color="dark" target="_blank" detail={false} href={href}>
      <IonLabel>Amazon Music で検索</IonLabel>
    </IonItem>
  );
};
