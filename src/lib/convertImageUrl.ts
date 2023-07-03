import type { Maybe } from "~/graphql/types";

export const convertImageUrl = ({
  url,
  px,
}: {
  url?: string | Maybe<string>;
  px: number;
}) => {
  if (!url) {
    return "/assets/no-image.png";
  }
  if (url.startsWith("http")) {
    const decodedUrl = decodeURI(url);
    return decodedUrl.replace("/{w}x{h}", `/${px}x${px}`);
  }
  return `data:image/png;base64,${url}`;
};
