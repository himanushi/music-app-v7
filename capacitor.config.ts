import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "net.video-game-music",
  appName: "ゲーム音楽",
  webDir: "dist",
  server: {
    androidScheme: "capacitor",
  },
};

export default config;
