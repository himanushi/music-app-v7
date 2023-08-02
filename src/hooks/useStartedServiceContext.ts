import { isEqual } from "lodash";
import { useState, useEffect } from "react";
import { Interpreter, EventObject } from "xstate";

export const useStartedServiceContext = <Context, Event extends EventObject>(
  service: Interpreter<Context, any, Event, any, any>
) => {
  const [context, setContext] = useState<Context>(service.getSnapshot().context);

  useEffect(() => {
    const { unsubscribe } = service.subscribe((nextState) => {
      if (isEqual(context, nextState.context) === false) {
        setContext(nextState.context);
      }
    });

    return () => unsubscribe();
  }, [service, context]);

  return { context };
};
