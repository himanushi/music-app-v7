/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TypedDocumentNode,
  WatchQueryFetchPolicy,
  useQuery,
} from "@apollo/client";
import { useCallback, useMemo, useState } from "react";

interface UseFetchItemsOptions<V extends { [key: string]: any }> {
  limit: number;
  doc: TypedDocumentNode<any, V>;
  variables: V;
  fetchPolicy?: WatchQueryFetchPolicy;
}

export const useFetchItems = <
  T,
  V extends { [key: string]: any } = { [key: string]: any }
>({
  limit,
  doc,
  variables,
  fetchPolicy = "cache-first",
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

  return { items: items as T[], fetchMore, resetOffset };
};
