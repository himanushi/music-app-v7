import { Preferences } from "@capacitor/preferences";

export class CapacitorPreferencesWrapper {
  async getItem(key: string) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  }

  setItem(key: string, data: any) {
    return Preferences.set({ key, value: JSON.stringify(data) });
  }

  removeItem(key: string) {
    return Preferences.remove({ key });
  }
}
