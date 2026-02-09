import {Storage} from 'redux-persist';
import {createMMKV} from 'react-native-mmkv';

class ReduxStorage implements Storage {
  readonly storage: ReturnType<typeof createMMKV>;

  constructor() {
    this.storage = createMMKV({id: 'redux-storage'});
  }

  async getItem(key: string) {
    const result = await this.storage.getString(key);
    console.log(key, result);
    return result ?? '';
  }

  async setItem(key: string, value: string) {
    if (typeof value === 'string') {
      await this.storage.set(key, value);
    } else {
      await this.storage.set(key, JSON.stringify(value));
    }
  }

  async removeItem(key: string) {
    this.storage.remove(key);
  }
}

let cacheStorage: ReduxStorage | null = null;
export function reduxStorage() {
  if (!cacheStorage) {
    cacheStorage = new ReduxStorage();
  }
  return cacheStorage;
}