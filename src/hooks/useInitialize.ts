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
            build: "5.0.1",
            name: "video-game-music.net",
          },
          developerToken: data.appleMusicToken,
        },
        type: "SET_TOKEN",
      });
    }
  }, [data]);
};
