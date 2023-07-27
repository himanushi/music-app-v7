import { useEffect, useState } from "react";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useMusicKit } from ".";

const replaceName = (name: string) =>
  // 名前が長すぎる場合は検索で引っかからないのでなるべく短い名前にする
  // eslint-disable-next-line prefer-named-capture-group
  name.replace(/(?!^)(\[|\(|-|:|〜|~|,|\s).*/gu, "");

export const useSearchLibraryAlbum = ({
  catalogAlbumName,
  catalogAlbumId,
}: {
  catalogAlbumName?: string;
  catalogAlbumId?: string;
}) => {
  const { isAuthorized } = useMusicKit();
  const [libraryAlbum, setLibraryAlbum] = useState<MusicKit.LibraryAlbums>();

  useEffect(() => {
    if (!isAuthorized || !catalogAlbumId || !catalogAlbumName) return;

    CapacitorMusicKit.api<MusicKit.LibraryAlbums>({
      url: `/v1/catalog/jp/albums/${catalogAlbumId}/library`,
    })
      .then((response) => {
        console.log("response");
        console.log(response);
        if (response && response.data && response.data.length > 0)
          setLibraryAlbum(response.data[0]);
      })
      .catch(() => {
        console.log("error");
        CapacitorMusicKit.api<any>({
          url: `/v1/me/library/search?types=library-albums&limit=25&term=${replaceName(
            catalogAlbumName
          )}`,
        }).then((response: any) => {
          console.log("response2");
          console.log(response);
          const albums = response.results["library-albums"] as
            | { data: MusicKit.LibraryAlbums[] }
            | undefined;
          if (albums) {
            const album = albums.data.find(
              (album) => album.attributes.name === catalogAlbumName
            );
            if (album) {
              setLibraryAlbum(album);
            }
          }
        });
      });
  }, [catalogAlbumId, catalogAlbumName, isAuthorized]);

  return { libraryAlbum };
};
