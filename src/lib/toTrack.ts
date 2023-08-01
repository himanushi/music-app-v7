import { TrackObject } from "~/graphql/types";
import { Track } from "~/machines/musicPlayerMachine";

export const toTrack = (track: TrackObject | MusicKit.LibrarySongs): Track => {
  if ("attributes" in track) {
    // MusicKit.LibrarySongs
    return {
      id: track.id,
      appleMusicId: track.id,
      name: track.attributes.name,
      artworkUrl: track.attributes.artwork.url,
      trackNumber: track.attributes.trackNumber
    }
  } else {
    return {
      id: track.id,
      appleMusicId: track.appleMusicId,
      name: track.name,
      artworkUrl: track.artworkM.url,
      trackNumber: track.trackNumber
    }
  }
}
