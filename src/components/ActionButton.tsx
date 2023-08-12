import { IonButton } from "@ionic/react"

export const ActionButton = (props: React.ComponentProps<typeof IonButton>) =>
  <IonButton style={{ fontWeight: "700" }} {...props} />
