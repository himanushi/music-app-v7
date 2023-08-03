import { useQuery } from "@apollo/client";
import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";
import { AppleMusicTokenDocument } from "~/graphql/types";
import { appleMusicAccountService } from "~/machines/appleMusicAccountMachine";

export const useInitialize = () => {
  const { data } = useQuery(AppleMusicTokenDocument, {
    fetchPolicy: "cache-and-network", skip: Capacitor.getPlatform() === "ios"
  });

  // Web
  useEffect(() => {
    if (data?.appleMusicToken) {
      appleMusicAccountService.send({
        config: {
          app: {
            build: "2.0.1",
            name: "video-game-music.net",
          },
          developerToken: data.appleMusicToken,
          storefrontId: "jp",
        },
        type: "SET_TOKEN",
      });
    }
  }, [data]);

  // iOS
  useEffect(() => {
    if (Capacitor.getPlatform() === "ios") {
      appleMusicAccountService.send({ type: "CHECKING" });
    }
  }, []);
};
