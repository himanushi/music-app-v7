import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client/core";
import type { RequestHandler } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { Observable, asyncMap } from "@apollo/client/utilities";
import { Capacitor } from "@capacitor/core";
import { store } from "~/lib/store";
import { graphqlUrl } from "~/lib/variable";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { persistCache } from "apollo3-cache-persist";
import { CapacitorPreferencesWrapper } from "./CapacitorPreferencesWrapper";

const uri = graphqlUrl ?? "http://localhost:3000/graphql";

const httpLink = new HttpLink({
  credentials: "include",
  uri,
});

const setResponseTokenLink = new ApolloLink((operation, forward) =>
  asyncMap(forward(operation), async (response) => {
    if (response.extensions?.Authorization) {
      await store.set("Authorization", response.extensions.Authorization);
    }
    return response;
  })
);

const setRequestTokenLink = setContext(async (_, { headers }) => {
  const token = await store.get<string>("Authorization");
  return {
    headers: {
      ...headers,
      Authorization: token ? token : "",
    },
  };
});

const capacitorLink = new ApolloLink((operation, forward) => {
  if (operation.operationName === "LibraryAlbums") {
    return new Observable((observer) => {
      CapacitorMusicKit.getLibraryAlbums(operation.variables)
        .then((data) => {
          const items = data.data.map((item) => {
            const newAttributes: any = { ...item.attributes };

            for (const field in libraryAlbumsFields) {
              if (!newAttributes[field]) {
                newAttributes[field] = libraryAlbumsFields[field];
              }
            }

            return {
              __typename: "LibraryAlbum",
              ...item,
              attributes: newAttributes,
            };
          });

          observer.next({ data: { items } });
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  }
  return forward(operation);
});

const links: (ApolloLink | RequestHandler)[] =
  Capacitor.getPlatform() === "web"
    ? [capacitorLink, httpLink]
    : [capacitorLink, setResponseTokenLink, setRequestTokenLink, httpLink];

const link = ApolloLink.from(links);

const offsetLimitPagination = {
  keyArgs: [
    "conditions",
    [
      "name",
      "status",
      "favorite",
      "isMine",
      "artistIds",
      "albumIds",
      "trackIds",
      "random",
    ],
    "sort",
    ["order", "direction"],
  ],

  merge(existing = [], incoming = []) {
    return [...existing, ...incoming];
  },
};

async function initializeApollo() {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          albums: offsetLimitPagination,
          artists: offsetLimitPagination,
          playlists: offsetLimitPagination,
          tracks: offsetLimitPagination,
          LibraryAlbums: {
            keyArgs: ["limit", "offset"],
            merge(existing: any[] = [], incoming: any[] = []) {
              return [...existing, ...incoming];
            },
            read(existing: any[]) {
              return existing;
            },
          },
        },
      },
    },
  });

  await persistCache({
    cache,
    storage: new CapacitorPreferencesWrapper(),
  });

  const client = new ApolloClient({
    cache,
    link,
  });

  return client;
}

export const client = await initializeApollo();

export const LibraryAlbumsDocument = gql`
  query LibraryAlbums($limit: Int, $offset: Int) {
    items: LibraryAlbums(limit: $limit, offset: $offset) {
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
