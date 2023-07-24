import { IonImg } from "@ionic/react";

export const SquareImage = ({
  src: imgSrc,
  maxWidth = "500px",
}: {
  src?: string;
  maxWidth?: string;
}) => {
  const src = imgSrc ?? "/assets/no-image.png";
  return (
    <IonImg
      src={src}
      onError={(e: any) => {
        e.target.onerror = null;
        e.target.src = "/assets/no-image.png";
      }}
      style={{
        aspectRatio: "auto 1 / 1",
        height: "100%",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth,
      }}
    />
  );
};
