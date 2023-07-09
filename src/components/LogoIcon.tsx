import { IonIcon } from "@ionic/react";

export type LogoIconName =
  | "amazon-music"
  | "apple-music"
  | "itunes"
  | "line"
  | "spotify"
  | "youtube";

export const LogoIcon = ({
  name,
  slot,
}: {
  name: LogoIconName;
  slot: "start" | "end" | "icon-only";
}) => {
  return <IonIcon slot={slot} src={`/assets/logo-${name}.svg`} />;
};
