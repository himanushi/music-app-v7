import { useEffect, useState } from "react";
import { useStartedServiceState } from ".";
import { appleMusicAccountService } from "~/machines";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";

export const useMusicKit = () => {
  const [hasMusicSubscription, setHasMusicSubscription] = useState(false);
  const { state } = useStartedServiceState(appleMusicAccountService);
  const isAuthorized = state && state.matches("authorized")

  useEffect(() => {
    if (!isAuthorized) return;
    CapacitorMusicKit.hasMusicSubscription().then((hasSubscription) => {
      setHasMusicSubscription(hasSubscription.result);
    });
  }, [isAuthorized]);

  return {
    isReady: state && !state.matches("checking"),
    isAuthorized,
    hasMusicSubscription
  };
};
