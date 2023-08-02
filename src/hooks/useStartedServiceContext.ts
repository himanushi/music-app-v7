import { useState, useEffect } from "react";
import { Interpreter, EventObject } from "xstate";

export const useStartedServiceContext = <Context, Event extends EventObject>(
  service: Interpreter<Context, any, Event, any, any>
) => {
  const [context, setContext] = useState<Context>(service.getSnapshot().context);

  useEffect(() => {
    const { unsubscribe } = service.subscribe((nextState) => {
      console.log("update context")
      setContext(nextState.context);
    });

    return () => unsubscribe();
  }, [service, context]);

  return { context };
};
