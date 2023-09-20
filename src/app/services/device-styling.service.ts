import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceStylingService {
  constructor() {}

  iOS() {
    return (
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  }

  iOSHomeBg(type: string) {
    if (type === 'att') {
      if (this.iOS()) {
        return 'scroll';
      } else {
        return 'fixed';
      }
    } else if (type === 'size') {
      if (this.iOS()) {
        return '100% 100%';
      } else {
        return '100% var(--vh)';
      }
    } else {
      return '100% 100%';
    }
  }

  iOSHideScroll() {
    if (this.iOS()) {
      return { 'hide-scroll': false };
    } else {
      return { 'hide-scroll': true };
    }
  }

  iOSSetZoom() {
    if (this.iOS()) {
      return false;
    } else {
      return true;
    }
  }
}
