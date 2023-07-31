import { useStartedServiceState } from ".";
import { appleMusicAccountService } from "~/machines";

export const useMusicKit = () => {
  const { state } = useStartedServiceState(appleMusicAccountService);
  return {
    isAuthorized: state && state.matches("authorized"),
    isReady: state && !state.matches("checking"),
  };
};
