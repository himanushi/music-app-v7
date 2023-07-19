/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TypedDocumentNode,
  WatchQueryFetchPolicy,
  useQuery,
} from "@apollo/client";
import { RefresherEventDetail } from "@ionic/react";
import { useCallback, useMemo } from "react";
import { client } from "~/graphql/client";

type VariablesType<T extends TypedDocumentNode<any, any>> =
  T extends TypedDocumentNode<any, infer V> ? V : never;

interface UseFetchItemsOptions<D extends TypedDocumentNode<any, any>> {
  limit: number;
  doc: D;
  variables: VariablesType<D>;
  fetchPolicy?: WatchQueryFetchPolicy;
  refreshName?: string;
}

export const useFetchItems = <T, D extends TypedDocumentNode<any, any>>({
  limit,
  doc,
  variables,
  fetchPolicy = "cache-first",
  refreshName,
}: UseFetchItemsOptions<D>) => {
  const { data, fetchMore: fetchMoreQuery } = useQuery(doc, {
    variables,
    fetchPolicy,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  const fetchMore = useCallback(() => {
    fetchMoreQuery({ variables: { cursor: { limit, offset: items.length } } });
  }, [fetchMoreQuery, limit, items.length]);

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
