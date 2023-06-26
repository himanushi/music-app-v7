import { IonImg } from "@ionic/react";

export const SquareImage = ({ src: imgSrc }: { src?: string }) => {
  const src = imgSrc ?? "/assets/no-image.png";
  return (
    <IonImg
      src={src}
      style={{
        aspectRatio: "auto 1 / 1",
        height: "100%",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "500px",
      }}
    />
  );
};
