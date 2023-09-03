import { IonItem, IonLabel } from "@ionic/react";

export const LineMusicItem = ({ name }: { name: string }) => {
  const href = `https://music.line.me/webapp/search/tracks?query=${name}`;

  return (
    <IonItem color="dark" target="_blank" detail={false} href={href}>
      <IonLabel>Line Music で検索</IonLabel>
    </IonItem>
  );
};
