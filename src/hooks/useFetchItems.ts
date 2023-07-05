/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedDocumentNode, useQuery } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";

interface UseFetchItemsOptions<V extends { [key: string]: any }> {
  limit: number;
  doc: TypedDocumentNode<any, V>;
  variables: V;
}

export const useFetchItems = <
  T,
  V extends { [key: string]: any } = { [key: string]: any }
>({
  limit,
  doc,
  variables,
}: UseFetchItemsOptions<V>) => {
  const [offset, setOffset] = useState(0);

  const { data, fetchMore: fetchMoreQuery } = useQuery(doc, {
    variables,
    fetchPolicy: "cache-first",
  });

  const fetchMore = useCallback(() => {
    setOffset((prevOffset) => prevOffset + limit);
    fetchMoreQuery({ variables: { cursor: { limit, offset } } });
  }, [fetchMoreQuery, limit, offset]);

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  const resetOffset = useCallback(() => setOffset(0), []);

  return { items: items as T[], fetchMore, resetOffset };
};