import { LibraryTracksAttributes } from "~/graphql/appleMusicClient";
import { getApolloData } from ".";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";

export const playableTrackIds = async (rawAppleMusicIds: string[]) => {
  const appleMusicIds = rawAppleMusicIds.map((appleMusicId) => {
    const catalog = getApolloData<MusicKit.LibrarySongs>({
      typeName: "CatalogTrack",
      id: appleMusicId,
      attributes: LibraryTracksAttributes,
    });

    return catalog?.attributes.playParams?.id ?? appleMusicId;
  })

  const libraryIds = appleMusicIds.filter((appleMusicId) => appleMusicId.startsWith("i."));
  const ids: string[] = []
  if (libraryIds.length > 0) {
    const result = await CapacitorMusicKit.api<MusicKit.LibraryAlbums>({ url: "/v1/me/library/songs", params: { ids: libraryIds } })
    "data" in result && result.data.forEach((track) => {
      if (track.id) ids.push(track.id)
    })
  }

  const catalogIds = appleMusicIds.filter((appleMusicId) => !appleMusicId.startsWith("l."));
  if (catalogIds.length > 0) {
    const result = await CapacitorMusicKit.api<MusicKit.LibraryAlbums>({ url: "/v1/catalog/jp/songs", params: { ids: catalogIds } })
    "data" in result && result.data.forEach((track) => {
      if (track.id) ids.push(track.id)
    })
  }

  return ids
};
