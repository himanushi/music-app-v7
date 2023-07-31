import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useEffect, useState, useRef } from "react";
import { useMusicKit } from ".";

export const useMusicKitAPI = <T>({
  url,
  skip = false,
}: {
  url: string;
  skip?: boolean;
}) => {
  const { isAuthorized } = useMusicKit();
  const [items, setItems] = useState<T[]>([]);
  const isFirstRun = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthorized || skip) {
      return;
    }
    if (!isFirstRun.current[url]) {
      isFirstRun.current[url] = true;
      return;
    }
    CapacitorMusicKit.api<T>({ url }).then((res) => {
      if (res && "data" in res && res.data && res.data.length > 0)
        setItems(res.data);
    });
  }, [isAuthorized, url, skip]);

  return { items };
};
