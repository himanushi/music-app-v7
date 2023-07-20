import { ApolloLink, gql } from "@apollo/client/core";
import type { Operation } from "@apollo/client/core";
import { Observable } from "@apollo/client/utilities";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";

const libraryItemsObservable = ({
  musicKitFunction,
  operation,
  libraryFields,
  typeName,
}: {
  musicKitFunction: (variables: any) => Promise<any>;
  operation: Operation;
  libraryFields: any;
  typeName: string;
}) =>
  new Observable<any>((observer) => {
    musicKitFunction(operation.variables)
      .then((data) => {
        const items = data.data.map((item: any) => {
          const newAttributes: any = { ...item.attributes };

          for (const field in libraryFields) {
            if (!newAttributes[field]) {
              newAttributes[field] = libraryFields[field];
            }
          }

          return {
            __typename: typeName,
            ...item,
            attributes: newAttributes,
          };
        });

        observer.next({ data: { items } });
        observer.complete();
      })
      .catch(observer.error.bind(observer));
  });

export const capacitorLink = new ApolloLink((operation, forward) => {
  if (operation.operationName === "LibraryAlbums") {
    return libraryItemsObservable({
      musicKitFunction: CapacitorMusicKit.getLibraryAlbums,
      operation,
      libraryFields: libraryAlbumsFields,
      typeName: "LibraryAlbum",
    });
  } else if (operation.operationName === "LibraryTracks") {
    return libraryItemsObservable({
      musicKitFunction: CapacitorMusicKit.getLibrarySongs,
      operation,
      libraryFields: libraryTracksFields,
      typeName: "LibraryTrack",
    });
  }

  return forward(operation);
});

const libraryItemsPolicy = {
  keyArgs: ["ids", "albumId"],
  merge(existing: any[] = [], incoming: any[] = []) {
    return [...existing, ...incoming];
  },
  read(existing: any[]) {
    return existing;
  },
};

export const libraryPolicies = {
  LibraryAlbums: libraryItemsPolicy,
  LibraryArtists: libraryItemsPolicy,
  LibraryTracks: libraryItemsPolicy,
  LibraryPlaylists: libraryItemsPolicy,
};

export const LibraryAlbumsDocument = gql`
  query LibraryAlbums($limit: Int, $offset: Int, $ids: [String!]) {
    items: LibraryAlbums(limit: $limit, offset: $offset, ids: $ids) {
      id
      attributes {
        artwork {
          url
        }
        dateAdded
        name
        releaseDate
        trackCount
      }
    }
  }
`;

const libraryAlbumsFields = {
  artwork: { url: "" },
  dateAdded: "",
  name: "",
  releaseDate: "",
  trackCount: 0,
} as any;

export const LibraryTracksDocument = gql`
  query LibraryTracks($limit: Int, $offset: Int, $albumId: String) {
    items: LibraryTracks(limit: $limit, offset: $offset, albumId: $albumId) {
      id
      attributes {
        artwork {
          url
        }
        discNumber
        trackNumber
        name
        releaseDate
        durationInMillis
        playParams {
          id
        }
      }
    }
  }
`;

const libraryTracksFields = {
  artwork: {
    url: "",
  },
  discNumber: 1,
  trackNumber: 1,
  name: "",
  releaseDate: "",
  durationInMillis: 0,
  playParams: {
    id: "",
  },
  // artistName: "",
  // albumName: "",
  // hasCredits: false,
  // genreNames: [],
  // hasLyrics: false,
} as any;
