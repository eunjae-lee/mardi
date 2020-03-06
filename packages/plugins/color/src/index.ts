import { SearchResults, copyToClipboard } from 'mardi-helper';

export function search(expression: string): SearchResults {
  return {
    list: flatten(
      [rgbToHex, rgbaToHex, hexToRgb, hexWithAlpha].map(fn => fn(expression))
    )
      .filter(notEmpty)
      .map(value => ({
        title: value,
        payload: value,
      })),
  };
}

export function runAction(payload: string) {
  copyToClipboard(payload);
}

function flatten(array: any[]) {
  return array.reduce((acc: any[], val: any) => acc.concat(val), []);
}

function notEmpty<TValue>(value: TValue | null): value is TValue {
  return value !== null && value !== undefined;
}

function rgbToHex(expression: string) {
  const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(expression);
  if (result) {
    const [, ...rest] = result;
    return [numbersToHex(...rest)];
  } else {
    return [];
  }
}

function rgbaToHex(expression: string) {
  const result = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/i.exec(expression);
  if (result) {
    const [, ...rest] = result;
    return [numbersToHex(...rest)];
  } else {
    return [];
  }
}

function hexToRgb(expression: string) {
  const result = /#[0-9a-zA-Z]{6,8}/.exec(expression);
  if (result && result[0] === expression) {
    const numbers = hexToNumbers(expression);
    return [`${numbers.length === 3 ? 'rgb' : 'rgba'}(${numbers.join(', ')})`];
  } else {
    return [];
  }
}

function hexWithAlpha(expression: string) {
  const result = /(#[0-9a-zA-Z]{6})\s?\*\s?(0\.\d+)/.exec(expression);
  if (result) {
    const [, hex, number] = result;
    const numbers = hexToNumbers(hex);
    return [
      hex + numberToHex(256 * Number(number)),
      `rgba(${[...numbers, number].join(', ')})`,
    ];
  } else {
    return [];
  }
}

function numbersToHex(...numbers: Array<string | number>) {
  return `#${numbers.map(numberToHex).join('')}`;
}

function numberToHex(number: string | number): string {
  const hex = Number(number)
    .toString(16)
    .split('.')[0];
  return hex.length === 2 ? hex : `0${hex}`;
}

function hexToNumbers(expression: string) {
  return expression
    .slice(1)
    .split(/(..)/)
    .filter(Boolean)
    .map(val => parseInt(val, 16));
}
