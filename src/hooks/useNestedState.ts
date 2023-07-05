/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

export const useNestedState = <T extends Record<string, any>>(
  initialState: T
): [T, (key: keyof T, subKey: keyof T[keyof T], value: any) => void] => {
  const [state, setState] = useState(initialState);

  const setNestedState = useCallback(
    (key: keyof T, subKey: keyof T[keyof T], value: any) => {
      setState((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          [subKey]: value,
        },
      }));
    },
    []
  );

  return [state, setNestedState];
};
