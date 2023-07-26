import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { useEffect, useState } from "react";

export const useMusicKitAPI = <T>({
  url,
  skip = false,
}: {
  url: string;
  skip?: boolean;
}) => {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    if (skip) return;
    CapacitorMusicKit.api<T>({
      url,
    }).then((res) => {
      if (res && res.data && res.data.length > 0) setItems(res.data);
    });
  }, [skip, url]);

  return { items };
};
