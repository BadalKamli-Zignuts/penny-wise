import "firebase/auth";

declare module "firebase/auth" {
  import type { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
  import type { Persistence } from "@firebase/auth";

  export function getReactNativePersistence(storage: AsyncStorageStatic): Persistence;
}
