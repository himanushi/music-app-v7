import { Preferences } from "@capacitor/preferences";

export class CapacitorPreferencesWrapper {
  async getItem(key: string) {
    const { value } = await Preferences.get({ key });
    return value ? value : null;
  }

  setItem(key: string, data: any) {
    return Preferences.set({ key, value: data });
  }

  removeItem(key: string) {
    return Preferences.remove({ key });
  }
}
