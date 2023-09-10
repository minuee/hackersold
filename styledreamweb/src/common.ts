import { BASE_FILE_PATH } from "env";

export function getFullFilePath(path: string) {
  return BASE_FILE_PATH + path;
}
