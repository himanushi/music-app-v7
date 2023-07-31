import { isEqual } from "lodash";
import { useState, useEffect } from "react";
import { Interpreter, EventObject, State } from "xstate";

export const useStartedServiceState = <Context, Event extends EventObject>(
  service: Interpreter<Context, any, Event, any, any>
) => {
  const [state, setState] = useState<State<Context, Event, any, any, any>>();

  useEffect(() => {
    const { unsubscribe } = service.subscribe((nextState) => {
      if (
        nextState.changed !== undefined &&
        nextState.changed &&
        isEqual(nextState.value, state?.value) === false
      ) {
        setState(nextState);
      }
    });

    return () => unsubscribe();
  }, [service, state]);

  return { state };
};
