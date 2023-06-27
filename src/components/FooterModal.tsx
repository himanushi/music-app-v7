import { IonContent, IonModal } from "@ionic/react";

export const FooterModal = () => {
  return (
    <IonModal
      isOpen={true}
      initialBreakpoint={0.2}
      breakpoints={[0.2, 0.95]}
      backdropDismiss={false}
      backdropBreakpoint={0.9}
    >
      <IonContent color="dark-gray" forceOverscroll={false}>
        aa
      </IonContent>
    </IonModal>
  );
};
