import { IonFooter, IonPage } from "@ionic/react";
import { ReactNode } from "react";

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    <IonPage className="pc-safe-area">
      {children}
      <IonFooter
        style={{
          height: "calc(var(--ion-safe-area-bottom, 0px) + 118px)",
        }}
      />
    </IonPage>
  );
};
