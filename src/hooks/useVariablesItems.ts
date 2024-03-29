import { CheckboxChangeEventDetail } from "@ionic/react";
import { useCallback } from "react";

export const useVariablesItems = ({
  scrollElement,
  setNestedState,
}: {
  scrollElement: HTMLElement | undefined;
  setNestedState: (
    key: "conditions" | "sort" | "cursor",
    subKey: string,
    value: any
  ) => void;
}) => {
  const reset = useCallback(() => {
    scrollElement?.scrollTo({ top: 0 });
  }, [scrollElement]);

  const changeInput = useCallback(
    (event: Event) => {
      reset();
      const target = event.target as HTMLIonSearchbarElement;
      const query = target.value ? target.value.toLowerCase() : "";
      setNestedState("conditions", "name", query ? query : undefined);
    },
    [reset, setNestedState]
  );

  const changeSort = useCallback(
    (sort: string) => {
      reset();
      const [order, direction] = sort.split(".");
      setNestedState("sort", "order", order);
      setNestedState("sort", "direction", direction);
    },
    [reset, setNestedState]
  );

  const changeFavorite = useCallback(
    (event: CustomEvent<CheckboxChangeEventDetail>) => {
      reset();
      setNestedState("conditions", "favorite", event.detail.checked);
    },
    [reset, setNestedState]
  );

  const changeStatus = useCallback(
    (status: string) => {
      reset();
      setNestedState("conditions", "status", status);
    },
    [reset, setNestedState]
  );

  return {
    changeInput,
    changeSort,
    changeFavorite,
    changeStatus,
  };
};
