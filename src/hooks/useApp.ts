import { App } from "@capacitor/app"
import { useEffect, useState } from "react"

export const useApp = () => {
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    const listener = App.addListener('appStateChange', (state) => {
      setIsActive(state.isActive);
    });
    return () => { listener.remove(); }
  }, []);

  return { isActive }
}
