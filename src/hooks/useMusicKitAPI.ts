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

  useEffect(() => {
    if (!isAuthorized || skip) {
      return;
    }
    if (items.length > 0) {
      return;
    }
    CapacitorMusicKit.api<T>({ url }).then((res) => {
      if (res && "data" in res && res.data && res.data.length > 0) {
        setItems(res.data);
      }
    });
  }, [isAuthorized, url, skip, items.length]);

  return { items };
};
