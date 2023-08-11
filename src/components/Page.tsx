import { IonFooter, IonPage } from "@ionic/react";
import { ReactNode } from "react";

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    <IonPage>
      {children}
      <IonFooter
        style={{
          height: "calc(var(--ion-safe-area-bottom, 0px) + 130px)",
        }}
      />
    </IonPage>
  );
};
