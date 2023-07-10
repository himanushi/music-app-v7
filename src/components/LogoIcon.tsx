import { IonIcon } from "@ionic/react";

export type LogoIconName =
  | "amazon-music"
  | "apple-music"
  | "itunes"
  | "line"
  | "spotify"
  | "youtube";

const sizeMap = {
  l: 40,
  m: 32,
  s: 24,
};

export const LogoIcon = ({
  name,
  slot,
  size = "m",
}: {
  name: LogoIconName;
  slot: "start" | "end" | "icon-only";
  size?: "s" | "m" | "l";
}) => {
  return (
    <IonIcon
      style={{ fontSize: `${sizeMap[size]}px` }}
      slot={slot}
      src={`/assets/logo-${name}.svg`}
    />
  );
};
