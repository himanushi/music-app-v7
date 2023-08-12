import { IonHeader, IonToolbar, IonTitle } from "@ionic/react"

export const SwitchTitle = () => {
  return <IonHeader collapse="condense">
    <IonToolbar className="ion-no-padding" style={{ height: "0px", paddingTop: "0px" }} >
      <IonTitle className="ion-no-padding" style={{ height: "0px" }} />
    </IonToolbar>
  </IonHeader>
}