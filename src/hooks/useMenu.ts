import { ReactComponentOrElement, useIonPopover } from "@ionic/react";

export const useMenu = ({
  component,
}: {
  component: ReactComponentOrElement;
}) => {
  const [present, dismiss] = useIonPopover(component, {
    onDismiss: () => dismiss(),
  });

  const open = (event: MouseEvent) => present({ event, side: "left" });
  return { open, close: dismiss };
};
