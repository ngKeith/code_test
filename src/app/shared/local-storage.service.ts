import { Injectable } from '@angular/core';
import * as localForage from 'localforage';

@Injectable()
export class LocalStorageService {
  getItem(key: string, callback: any): void {
    if (!localForage) {
      return;
    }

    localForage.getItem(key, callback);
  }

  setItem(key: any, value: any): void {
    if (!localForage) {
      return;
    }

    if (value === null) {
      value = undefined;
    }

    localForage.setItem(key, value);
  }

  clearData(key: any): void {
    if (!localForage) return;
    localForage.removeItem(key);
  }
}
