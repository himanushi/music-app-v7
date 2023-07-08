import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "net.himanushi.app",
  appName: "music-app-v7",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
