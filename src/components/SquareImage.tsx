import { IonImg } from "@ionic/react";
import { useState } from "react";

export const SquareImage = ({
  src: imgSrc,
  maxWidth = "500px",
}: {
  src?: string;
  maxWidth?: string;
}) => {
  const [src, setSrc] = useState(imgSrc ?? "/assets/no-image.png");
  return (
    <IonImg
      src={src}
      onIonError={(e: any) => {
        e.target.onerror = null;
        setSrc("/assets/no-image.png");
      }}
      style={{
        aspectRatio: "auto 1 / 1",
        height: "100%",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth,
        display: "flex",
        justifyContent: "center"
      }}
    />
  );
};
