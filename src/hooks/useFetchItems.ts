/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TypedDocumentNode,
  WatchQueryFetchPolicy,
  useQuery,
} from "@apollo/client";
import { RefresherEventDetail } from "@ionic/react";
import { useCallback, useMemo, useState } from "react";
import { client } from "~/graphql/client";

interface UseFetchItemsOptions<V extends { [key: string]: any }> {
  limit: number;
  doc: TypedDocumentNode<any, V>;
  variables: V;
  fetchPolicy?: WatchQueryFetchPolicy;
  refreshName?: string;
}

export const useFetchItems = <
  T,
  V extends { [key: string]: any } = { [key: string]: any }
>({
  limit,
  doc,
  variables,
  fetchPolicy = "cache-first",
  refreshName,
}: UseFetchItemsOptions<V>) => {
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
    (event: CustomEvent<RefresherEventDetail>) => {
      if (refreshName) {
        client.cache.evict({ fieldName: refreshName });
        // TODO: complete は refetch したタイミングにすること
        setTimeout(() => event.detail.complete(), 500);
      }
    },
    [refreshName]
  );

  return { items: items as T[], fetchMore, resetOffset, refresh };
};
