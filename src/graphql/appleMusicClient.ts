import { ApolloClient, InMemoryCache, gql, makeVar } from "@apollo/client";
import {
  CapacitorMusicKit,
  GetLibraryAlbumsOptions,
  GetLibraryArtistsOptions,
  GetLibraryPlaylistsOptions,
  GetLibrarySongsOptions,
} from "capacitor-plugin-musickit";
import { CapacitorPreferencesWrapper } from "./CapacitorPreferencesWrapper";
import { persistCache } from "apollo3-cache-persist";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        libraryAlbums: {
          read() {
            return libraryAlbumsVar();
          },
        },
        libraryArtists: {
          read() {
            return libraryArtistsVar();
          },
        },
        libraryPlaylists: {
          read() {
            return libraryPlaylistsVar();
          },
        },
        librarySongs: {
          read() {
            return librarySongsVar();
          },
        },
      },
    },
  },
});

type MusicKitVarType<T> = { items: T[]; next?: string };
const libraryAlbumsVar = makeVar<MusicKitVarType<MusicKit.LibraryAlbums>>({
  items: [],
});
const libraryArtistsVar = makeVar<MusicKitVarType<MusicKit.LibraryArtists>>({
  items: [],
});
const libraryPlaylistsVar = makeVar<MusicKitVarType<MusicKit.LibraryPlaylists>>(
  { items: [] }
);
const librarySongsVar = makeVar<MusicKitVarType<MusicKit.LibrarySongs>>({
  items: [],
});

await persistCache({
  cache,
  storage: new CapacitorPreferencesWrapper(),
});

export const appleMusicClient = new ApolloClient({
  cache,
  link: undefined,
});

export async function fetchLibraryAlbums(options: GetLibraryAlbumsOptions) {
  const result = await CapacitorMusicKit.getLibraryAlbums(options);
  libraryAlbumsVar({
    items: result.data,
    next: result.next,
  });
}

export async function fetchLibraryArtists(options: GetLibraryArtistsOptions) {
  const result = await CapacitorMusicKit.getLibraryArtists(options);
  libraryArtistsVar({
    items: result.data,
    next: result.next,
  });
}

export async function fetchLibraryPlaylists(
  options: GetLibraryPlaylistsOptions
) {
  const result = await CapacitorMusicKit.getLibraryPlaylists(options);
  libraryPlaylistsVar({
    items: result.data,
    next: result.next,
  });
}

export async function fetchLibrarySongs(options: GetLibrarySongsOptions) {
  const result = await CapacitorMusicKit.getLibrarySongs(options);
  librarySongsVar({
    items: result.data,
    next: result.next,
  });
}

export const GET_LIBRARY_ALBUMS = gql`
  query GetLibraryAlbums($limit: Int, $offset: Int) {
    libraryAlbums(limit: $limit, offset: $offset) @client {
      data
      next
    }
  }
`;

export const GET_LIBRARY_ARTISTS = gql`
  query GetLibraryArtists($limit: Int, $offset: Int) {
    libraryArtists(limit: $limit, offset: $offset) @client {
      data
      next
    }
  }
`;

export const GET_LIBRARY_PLAYLISTS = gql`
  query GetLibraryPlaylists($limit: Int, $offset: Int) {
    libraryPlaylists(limit: $limit, offset: $offset) @client {
      data
      next
    }
  }
`;

export const GET_LIBRARY_SONGS = gql`
  query GetLibrarySongs($limit: Int, $offset: Int) {
    librarySongs(limit: $limit, offset: $offset) @client {
      data
      next
    }
  }
`;
