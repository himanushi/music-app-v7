import { ReactComponentOrElement, useIonPopover } from "@ionic/react";

type PositionSide = 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
type PositionAlign = 'start' | 'center' | 'end';

export const useMenu = ({
  component,
  side = "left",
  alignment = "start",
}: {
  component: ReactComponentOrElement,
  side?: PositionSide,
  alignment?: PositionAlign
}) => {
  const [present, dismiss] = useIonPopover(component, {
    onDismiss: () => dismiss(),
  });

  const open = (event: any) => present({ event, side, alignment, arrow: false });
  return { open, close: dismiss };
};
