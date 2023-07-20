import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import type {
  NormalizedCacheObject,
  RequestHandler,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { asyncMap } from "@apollo/client/utilities";
import { Capacitor } from "@capacitor/core";
import { store } from "~/lib/store";
import { graphqlUrl } from "~/lib/variable";
import { persistCache } from "apollo3-cache-persist";
import { CapacitorPreferencesWrapper } from "./CapacitorPreferencesWrapper";
import { CapacitorFilesystemWrapper } from "./CapacitorFilesystemWrapper";
import { capacitorLink, libraryPolicies } from "./appleMusicClient";

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

export async function initializeApollo() {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          albums: offsetLimitPagination,
          artists: offsetLimitPagination,
          playlists: offsetLimitPagination,
          tracks: offsetLimitPagination,
          ...libraryPolicies,
        },
      },
    },
  });

  await persistCache({
    maxSize: false,
    cache,
    storage:
      Capacitor.getPlatform() === "web"
        ? new CapacitorPreferencesWrapper()
        : new CapacitorFilesystemWrapper(),
  });

  const client = new ApolloClient({
    cache,
    link,
  });

  return client;
}

export const client: {
  current: ApolloClient<NormalizedCacheObject> | undefined;
} = {
  current: undefined,
};
