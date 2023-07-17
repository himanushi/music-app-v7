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
import { persistCache } from "apollo3-cache-persist";
import { CapacitorPreferencesWrapper } from "./CapacitorPreferencesWrapper";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";

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
          console.log("LibraryAlbums", operation, data);

          client.writeQuery({
            query: LibraryAlbumsDocument,
            data: {
              items: data.data.map((item) => ({
                __typename: "LibraryAlbum",
                ...item,
                ...item.attributes,
              })),
            },
            variables: operation.variables,
          });

          observer.next({ data: { items: data.data } });
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
            merge(existing = { items: [] }, incoming = { items: [] }) {
              console.log("merge", existing, incoming);
              return [...existing.items, ...incoming.items];
            },
            read(existing) {
              console.log("read", existing);
              return existing?.items;
            },
          },
        },
      },
    },
  });

  // await persistCache({
  //   cache,
  //   storage: new CapacitorPreferencesWrapper(),
  // });

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
      name
    }
  }
`;
