import { NgZone } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function safeSetProperty(
  destinationObj: any,
  sourceObj: any,
  destinationPropName: string,
  sourcePropName?: string
) {
  sourcePropName = sourcePropName || destinationPropName;

  if (sourcePropName in sourceObj)
    destinationObj[destinationPropName] = sourceObj[sourcePropName];
}

export class StringUtils {
  public static getFirstNotEmptyOrDefault(
    defaultValue: string = '',
    ...inputArray: (string | number)[]
  ): string {
    if (Utils.isEmpty(inputArray)) return defaultValue;

    let notEmptyArray = inputArray.filter(Utils.isNotEmpty);

    if (Utils.isEmpty(notEmptyArray)) return defaultValue;

    return `${notEmptyArray[0]}`;
  }
  public static joinIfNotEmptyOrDefault(
    delimiter: string = ',',
    defaultValue: string = '',
    ...inputArray: (string | number)[]
  ): string {
    if (Utils.isEmpty(inputArray)) return defaultValue;

    return inputArray.filter(Utils.isNotEmpty).join(`${delimiter} `);
  }

  public static limit(input: string, maxLength: number): string {
    if (Utils.isEmpty(input)) return '';

    if (input.length > maxLength) return input.substring(0, maxLength);

    return input;
  }

  public static toTitleCase(input: string): string {
    return input.replace(/\w\S*/g, (stringText) => {
      return (
        stringText.charAt(0).toUpperCase() + stringText.substr(1).toLowerCase()
      );
    });
  }

  public static orDefault(input: string, defaultValue: string = ''): string {
    return Utils.orDefault(input, defaultValue);
  }

  public static isValidPhoneNumber(input: string): boolean {
    var regex = new RegExp(
      '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$'
    );
    if (input.match(regex)) return true;
    return false;
  }

  public static removeWhitespace(val: string | null | undefined) {
    if (Utils.isNullOrUndefined(val)) return val;
    return val ? val.replace(/\s/g, '') : val;
  }
}

export class Utils {
  public static runTimer(
    dueTime: number | Date,
    period: number,
    callbackFn: () => void,
    onErrorFn?: (error: any) => void,
    destroyTrigger?: Subject<void>,
    finishedTrigger?: Subject<void>
  ): void {
    let observable: any = null;
    if (destroyTrigger)
      observable = timer(dueTime, period).pipe(takeUntil(destroyTrigger));

    if (finishedTrigger)
      observable = observable.pipe(takeUntil(finishedTrigger));

    observable.subscribe(
      () => {
        if (callbackFn != null && typeof callbackFn !== 'undefined')
          callbackFn();
      },
      (error: any) => {
        if (onErrorFn != null && typeof onErrorFn !== 'undefined')
          onErrorFn(error);
      }
    );
  }

  public static callIfValid(fnToCall: any, $this?: any, ...params: any[]): any {
    if (!Utils.isFunction(fnToCall)) return false;

    if (Utils.isEmpty($this)) return fnToCall(...params);

    return fnToCall.call($this, ...params);
  }

  public static callOrDefault(
    fnToCall: any,
    defaultValue: any,
    $this?: any,
    ...params: any[]
  ): any {
    if (!Utils.isFunction(fnToCall)) return defaultValue;

    if (Utils.isEmpty($this)) return fnToCall(...params);

    return fnToCall.call($this, ...params);
  }

  public static populateFromAvailable(
    source: object,
    destination: object,
    onlyOverwrite: boolean = false
  ) {
    if (Utils.isEmpty(source) || Utils.isEmpty(destination)) return;

    for (let property in source)
      if (
        source.hasOwnProperty(property) &&
        (onlyOverwrite ? destination.hasOwnProperty(property) : true)
      )
        (<any>destination)[property] = (<any>source)[property];
  }

  public static isInRange(
    input: any,
    min?: number | undefined,
    max?: number | undefined
  ): boolean {
    if (Utils.isEmpty(input)) return false;
    if (Utils.isEmpty(min) && Utils.isEmpty(max)) return false;

    let inputNumber: number = Number(input);
    if (Utils.isEmpty(inputNumber)) return false;

    if (min != undefined)
      if (!Utils.isEmpty(min) && inputNumber < min) return false;
    if (max != undefined)
      if (!Utils.isEmpty(max) && inputNumber > max) return false;

    return true;
  }

  public static isFunction(input: any): boolean {
    return typeof input === 'function' && !Utils.isEmpty(input);
  }

  public static isString(input: any): boolean {
    return typeof input === 'string' && !Utils.isEmpty(input);
  }

  public static areAnyEmpty(...args: any[]): boolean {
    if (Utils.isEmpty(args)) return false;

    for (let arg in args) if (Utils.isEmpty(arg)) return true;

    return false;
  }

  public static orDefault(input: any, defaultValue?: any): any {
    if (Utils.isEmpty(input)) return defaultValue;

    return input;
  }

  public static isEmpty(input: any): boolean {
    if (input == null || typeof input === 'undefined') return true;

    if (input.hasOwnProperty('length')) {
      let length: number = input['length'];

      return length <= 0;
    }

    switch (typeof input) {
      case 'object':
        return Utils.isEmptyObject(input);
    }

    return false;
  }

  public static isNotEmpty(input: any): boolean {
    return !Utils.isEmpty(input);
  }

  public static isEmptyObject(input: any): boolean {
    return Object.keys(input).length === 0 && input.constructor === Object;
  }

  public static isObject(input: any): boolean {
    return (
      input != null && typeof input === 'object' && input.constructor === Object
    );
  }

  public static isEqualDeep(object1: any, object2: any): boolean {
    let object1Null = Utils.isEmpty(object1);
    let object2Null = Utils.isEmpty(object2);

    if (object1Null && object2Null) return true;
    if ((object1Null && !object2Null) || (!object1Null && object2Null))
      return false;

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = Utils.isObject(val1) && Utils.isObject(val2);

      if (
        (areObjects && !Utils.isEqualDeep(val1, val2)) ||
        (!areObjects && val1 !== val2)
      )
        return false;
    }

    return true;
  }

  public static getSafeNumber(
    inputNumber?: any,
    defaultValue: number = 0
  ): number {
    if (Utils.isEmpty(inputNumber)) {
      return defaultValue;
    }

    let numberValue: number = Number(inputNumber);

    if (Utils.isEmpty(numberValue)) {
      return defaultValue;
    }

    if (isNaN(numberValue)) {
      return defaultValue;
    }

    return numberValue;
  }

  public static getFormattedNumber(input: any): string {
    if (Utils.isEmpty(input)) return '?';

    let inputNumber = Utils.getSafeNumber(input, undefined);
    if (Utils.isEmpty(inputNumber)) return '?';

    return inputNumber.toFixed(2);
  }

  public static numberToHexColour(inputColour: number): string {
    return Utils.isNotEmpty(inputColour)
      ? `#${inputColour.toString(16).toUpperCase()}`
      : '#FFFFFF';
  }

  public static isNotNullOrUndefined(entity: any): boolean {
    return !this.isNullOrUndefined(entity);
  }

  public static isNullOrUndefined(entity: any): boolean {
    return entity === null || entity === undefined;
  }

  public static isArrayNullOrUndefinedOrEmpty(array: any[]): boolean {
    return array === null || array === undefined || array.length === 0;
  }

  public static getResponseErrorCode(error: any): number {
    if (Utils.isEmpty(error) || Utils.isEmpty(error['response'])) return 0;

    let responseObject = JSON.parse(error['response']);

    if (Utils.isEmpty(responseObject) || Utils.isEmpty(responseObject.error))
      return 0;

    return responseObject.error.code;
  }

  public static base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public static timeout(
    milliseconds: number,
    zoneService?: NgZone
  ): Promise<void> {
    if (Utils.isNotEmpty(zoneService))
      return new Promise((resolve) => {
        if (zoneService !== undefined)
          zoneService.runOutsideAngular(() =>
            setTimeout(resolve, milliseconds)
          );
      });

    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  public static getHashCode(obj: any): string {
    if (Utils.isEmpty(obj)) {
      return '';
    }

    let value: string = JSON.stringify(obj);
    var hash = 0,
      i: number,
      chr: number;

    if (value.length === 0) {
      return hash.toString();
    }

    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }

    return hash.toString();
  }
}
