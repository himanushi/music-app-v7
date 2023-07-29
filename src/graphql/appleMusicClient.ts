import { ApolloLink, gql } from "@apollo/client/core";
import type { Operation } from "@apollo/client/core";
import { Observable } from "@apollo/client/utilities";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";

const applyDefaultFields = (obj: any, defaultValues: any) => {
  for (const key in defaultValues) {
    if (typeof defaultValues[key] === "object" && defaultValues[key] !== null) {
      if (typeof obj[key] !== "object" || obj[key] === null) {
        obj[key] = { ...defaultValues[key] };
      } else {
        applyDefaultFields(obj[key], defaultValues[key]);
      }
    } else if (!obj[key]) {
      obj[key] = defaultValues[key];
    }
  }
  return obj;
};

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
    const metaId = operation.variables.albumId ?? operation.variables.ids ?? "";

    musicKitFunction(operation.variables)
      .then((data) => {
        const items = data.data.map((item: any) => {
          let newAttributes: any = { ...item.attributes };
          newAttributes = applyDefaultFields(newAttributes, libraryFields);

          return {
            __typename: typeName,
            ...item,
            attributes: newAttributes,
          };
        });

        observer.next({
          data: {
            items,
            meta: {
              __typename: `${typeName}Meta`,
              id: metaId,
              total: data.meta?.total ?? 0,
            },
          },
        });
        observer.complete();
      })
      .catch(() => {
        observer.next({
          data: {
            items: [],
            meta: {
              __typename: `${typeName}Meta`,
              id: metaId,
              total: 0,
            },
          },
        });
        observer.complete();
      });
  });

const libraryTracksObservable = ({
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
    const metaId = operation.variables.albumId ?? operation.variables.ids ?? "";

    musicKitFunction(operation.variables)
      .then((data) => {
        const CatalogTracks: any[] = [];

        const items = data.data.map((item: any) => {
          let newAttributes: any = { ...item.attributes };
          newAttributes = applyDefaultFields(newAttributes, libraryFields);

          const catalogId =
            newAttributes?.playParams?.catalogId ||
            newAttributes?.playParams?.purchasedId;
          if (catalogId) {
            const catalogTrack = {
              __typename: "CatalogTrack",
              ...item,
              attributes: newAttributes,
              id: catalogId,
            };
            catalogTrack.attributes.playParams.libraryId = item.id;
            CatalogTracks.push(catalogTrack);
          }

          return {
            __typename: typeName,
            ...item,
            attributes: newAttributes,
          };
        });

        observer.next({
          data: {
            items,
            CatalogTracks,
            meta: {
              __typename: `${typeName}Meta`,
              id: metaId,
              total: data.meta?.total ?? 0,
            },
          },
        });
        observer.complete();
      })
      .catch(() => {
        observer.next({
          data: {
            items: [],
            CatalogTracks: [],
            meta: {
              __typename: `${typeName}Meta`,
              id: metaId,
              total: 0,
            },
          },
        });
        observer.complete();
      });
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
    return libraryTracksObservable({
      musicKitFunction: CapacitorMusicKit.getLibrarySongs,
      operation,
      libraryFields: libraryTracksFields,
      typeName: "LibraryTrack",
    });
  } else if (operation.operationName === "LibraryArtists") {
    return libraryItemsObservable({
      musicKitFunction: CapacitorMusicKit.getLibraryArtists,
      operation,
      libraryFields: libraryArtistsFields,
      typeName: "LibraryArtist",
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
  CatalogTracks: libraryItemsPolicy,
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
    meta: LibraryAlbumMeta(ids: $ids) {
      total
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

export const LibraryTracksAttributes = `
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
    catalogId # Apple Music ID
    purchasedId # iTunes Store ID
  }
}
`;

export const LibraryTracksDocument = gql`
  query LibraryTracks($limit: Int, $offset: Int, $albumId: String) {
    items: LibraryTracks(limit: $limit, offset: $offset, albumId: $albumId) {
      ${LibraryTracksAttributes}
    }
    CatalogTracks(albumId: $albumId) {
      ${LibraryTracksAttributes}
    }
    meta: LibraryTrackMeta(albumId: $albumId) {
      total
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
    catalogId: "",
    purchasedId: "",
    libraryId: "",
  },
} as any;

export const LibraryArtistsDocument = gql`
  query LibraryArtists($limit: Int, $offset: Int, $albumId: String) {
    items: LibraryArtists(limit: $limit, offset: $offset, albumId: $albumId) {
      id
      attributes {
        name
      }
    }
    meta: LibraryArtistMeta(albumId: $albumId) {
      total
    }
  }
`;

const libraryArtistsFields = {
  name: "",
} as any;
