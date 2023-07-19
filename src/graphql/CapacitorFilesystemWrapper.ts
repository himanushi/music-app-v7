import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export class CapacitorFilesystemWrapper {
  async getItem(key: string) {
    try {
      const { data } = await Filesystem.readFile({
        path: `${key}.json`,
        encoding: Encoding.UTF8,
        directory: Directory.Documents,
      });
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading file", error);
      return null;
    }
  }

  async setItem(key: string, value: any) {
    try {
      await Filesystem.writeFile({
        path: `${key}.json`,
        data: value,
        encoding: Encoding.UTF8,
        directory: Directory.Documents,
        recursive: false,
      });
    } catch (error) {
      console.error("Error writing file", error);
    }
  }

  async removeItem(key: string) {
    try {
      await Filesystem.deleteFile({
        path: `${key}.json`,
        directory: Directory.Documents,
      });
    } catch (error) {
      console.error("Error deleting file", error);
    }
  }
}
