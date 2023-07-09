import { isEqual } from "lodash";
import { useState, useEffect } from "react";
import { Interpreter, EventObject, StateValue } from "xstate";

export const useStartedServiceState = <Context, Event extends EventObject>(
  service: Interpreter<Context, any, Event, any, any>
) => {
  const [state, setState] = useState<StateValue>(service.getSnapshot().value);

  useEffect(() => {
    const { unsubscribe } = service.subscribe((nextState) => {
      if (
        nextState.changed !== undefined &&
        nextState.changed &&
        isEqual(nextState.value, state) === false
      ) {
        setState(nextState.value);
      }
    });

    return () => unsubscribe();
  }, [service, state]);

  return { state };
};
