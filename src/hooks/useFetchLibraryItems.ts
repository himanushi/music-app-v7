/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DocumentNode,
  TypedDocumentNode,
  WatchQueryFetchPolicy,
  useQuery,
} from "@apollo/client";
import { RefresherEventDetail } from "@ionic/react";
import { useCallback, useMemo, useState } from "react";
import { client } from "~/graphql/client";

type VariablesType<T extends TypedDocumentNode<any, any>> =
  T extends TypedDocumentNode<any, infer V> ? V : never;

interface UseFetchItemsOptions<D extends TypedDocumentNode<any, any>> {
  limit: number;
  doc: D | DocumentNode;
  variables: VariablesType<D>;
  fetchPolicy?: WatchQueryFetchPolicy;
  refreshName?: string;
  skip?: boolean;
}

export const useFetchLibraryItems = <T, D extends TypedDocumentNode<any, any>>({
  limit,
  doc,
  variables,
  fetchPolicy = "cache-first",
  refreshName,
  skip = false,
}: UseFetchItemsOptions<D>) => {
  const { data, fetchMore: fetchMoreQuery } = useQuery(doc, {
    variables,
    fetchPolicy,
    skip,
    notifyOnNetworkStatusChange: true,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const [previousItemsLength, setPreviousItemsLength] = useState<number>(
    items.length
  );
  const fetchMore = useCallback(async () => {
    if (items.length % limit !== 0 || items.length === previousItemsLength)
      return;

    setPreviousItemsLength(items.length);
    await fetchMoreQuery({
      variables: { limit, offset: items.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return { ...fetchMoreResult };
      },
    });
  }, [fetchMoreQuery, items.length, limit, previousItemsLength]);

  const refresh = useCallback(
    (event?: CustomEvent<RefresherEventDetail>) => {
      if (refreshName) {
        client.current?.cache.evict({
          fieldName: refreshName,
          id: "ROOT_QUERY",
        });
        // TODO: complete は refetch したタイミングにすること
        setTimeout(() => event?.detail?.complete(), 500);
      }
    },
    [refreshName]
  );

  return { items: items as T[], fetchMore, refresh };
};
