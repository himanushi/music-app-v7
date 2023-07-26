import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { AppleMusicTokenDocument } from "~/graphql/types";
import { appleMusicAccountService } from "~/machines/appleMusicAccountMachine";

export const useInitialize = () => {
  const { data } = useQuery(AppleMusicTokenDocument);
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
};
