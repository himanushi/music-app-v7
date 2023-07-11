import { IonItem, IonList, IonSkeletonText } from "@ionic/react";

export const SkeletonItems = ({
  count,
  lines,
}: {
  count: number;
  lines?: "full" | "inset" | "none";
}) => {
  return (
    <IonList>
      {[...Array(count)].map((_, i) => (
        <IonItem lines={lines} button detail={false} key={i}>
          <IonSkeletonText />
        </IonItem>
      ))}
    </IonList>
  );
};
