/* eslint-disable @typescript-eslint/no-explicit-any */
import {
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
  const [offset, setOffset] = useState(limit);

  const { data, fetchMore: fetchMoreQuery } = useQuery(doc, {
    variables,
    fetchPolicy,
  });

  const fetchMore = useCallback(() => {
    setOffset((prevOffset) => prevOffset + limit);
    fetchMoreQuery({ variables: { cursor: { limit, offset } } });
  }, [fetchMoreQuery, limit, offset]);

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  const resetOffset = useCallback(() => setOffset(limit), [limit]);

  const refresh = useCallback(
    (event?: CustomEvent<RefresherEventDetail>) => {
      if (refreshName) {
        client.cache.evict({ fieldName: refreshName, id: "ROOT_QUERY" });
        // TODO: complete は refetch したタイミングにすること
        setTimeout(() => event?.detail?.complete(), 500);
      }
    },
    [refreshName]
  );

  return { items: items as T[], fetchMore, resetOffset, refresh };
};
