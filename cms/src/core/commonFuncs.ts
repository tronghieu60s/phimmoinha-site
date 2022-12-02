import { DELAY_TIMER } from '@const/config';

/**
 * @param  {string} str
 */
export const capitalize = (str: string): string =>
  str
    .toLowerCase()
    .split(' ')
    .map((o) => o.charAt(0).toUpperCase() + o.slice(1))
    .join(' ');

/**
 * @param  {number} ms
 */
// eslint-disable-next-line no-promise-executor-return
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 */
export const delayLoading = () => delay(DELAY_TIMER);

/**
 * @param  {string} str
 */
export const stripHtml = (str: string) => {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.body.textContent || '';
};

/**
 * @param  {string} str
 */
export const isUrl = (str: string) =>
  /^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g.test(str);

/**
 * @param  {string} slug
 */
export const isValidSlug = (slug: string) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * @param  {object} obj
 */
export const isEmptyObject = (obj: object | null) => {
  if (obj) {
    return Object.keys(obj).length === 0;
  }
  return true;
};

/**
 * @param  {string} o1
 * @param  {string} o2
 */
export const isFilterEqual = (o1: string | undefined, o2: string | undefined) => {
  const k = (o1 || '').trim().toLowerCase();
  const l = (o2 || '').trim().toLowerCase();
  return k === l;
};

/**
 * @param  {string} o1
 * @param  {string} o2
 */
export const isFilterIncludes = (o1: string | string[] | undefined, o2: string | undefined) => {
  let k = o1 || [];
  if (o1 instanceof String) {
    k = (o1 || '').trim().toLowerCase();
  }
  const l = (o2 || '').trim().toLowerCase();
  return k?.includes(l);
};

/**
 * @param  {string} o1
 * @param  {string} o2
 */
export const isFilterBetween = (
  o1: number | Date | undefined,
  o2: number[] | Date[] | undefined,
) => {
  let k: number | Date = 0;
  let l1: number | Date = 0;
  let l2: number | Date = 0;

  if (typeof o1 === 'number') {
    k = o1 || 0;
    l1 = o2?.[0] || 0;
    l2 = o2?.[1] || 0;
  }
  if (o1 instanceof Date) {
    k = o1 ? o1.valueOf() : 0;
    l1 = o2?.[0] ? o2?.[0].valueOf() : 0;
    l2 = o2?.[1] ? o2?.[1].valueOf() : 0;
  }

  return l1 <= k && k <= l2;
};

/**
 * @param  {object={}} o
 */
export const objectToQueryParams = (o: object = {}) =>
  Object.entries(o)
    .map((p) => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`)
    .join('&');

/**
 * @param  {string='?'} s
 */
export const queryParamsToObject = (s: string = '?') => {
  const search = s.substring(1);
  if (search.length > 0) {
    return JSON.parse(`{"${search.replace(/&/g, '","').replace(/=/g, '":"')}"}`, (key, value) =>
      key === '' ? value : decodeURIComponent(value),
    );
  }
  return {};
};

/**
 * @param  {any[]} arr
 */
export const mapUniqueArray = (arr: any[]) => arr.filter((item, pos) => arr.indexOf(item) === pos);

/**
 * @param  {any[]} arr
 * @param  {string} key
 */
export const mapUniqueArrayByKey = (arr: any[], key: string) =>
  arr.filter((item, pos) => arr.map((o) => o[key]).indexOf(item[key]) === pos);

/**
 * @param  {number} length
 */
export const randomString = (length: number) =>
  Math.random()
    .toString(36)
    .slice(2, length + 2);

/**
 * @param  {number} length
 */
export const randomNumber = (length: number) => Math.floor(Math.random() * Math.floor(length));

/**
 */
export const randomHexColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

/**
 * @param  {string} str
 */
export const removeVnTones = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

/**
 * @param  {string} str
 */
export const generateSlug = (str: string) => {
  const rmTones = stripHtml(str)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^\w\s]/gi, '');
  return rmTones.replace(/\s+/g, '-');
};

/**
 * @param  {File} file
 * @returns File | Promise<File>
 */
export const convertImageToWebp = (file: File): File | Promise<File> =>
  new Promise((resolve, reject) => {
    if (file.type.includes('webp') || !file.type.includes('image')) {
      resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const image = new File([blob], `${file.name.split('.')[0]}.webp`, {
                type: blob.type,
              });
              resolve(image);
            } else {
              reject(new Error('Can not creating webp'));
            }
          }, 'image/webp');
        } else {
          reject(new Error('Can not creating webp'));
        }
      };
    };
  });

/**
 * @param  {File} file
 * @returns Promise
 */
export const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

/**
 * @param  {number} bytes
 */
export const convertBytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`;
};

/**
 * @param  {string} str
 */
export const convertStringToHexColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
};

/**
 * @param  {any} obj
 * @returns any
 */
export const convertObjectToArray = (obj: any): any[] => {
  const arr: any = [];
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      arr.push({ key, value: obj[key] });
    }
  });
  return arr;
};

/**
 * @param  {any[]} arr
 * @param  {string} key
 * @param  {string} value?
 */
export const convertArrayToObject = (arr: any[], key: string, value?: string): any => {
  const obj: any = {};
  arr.forEach((item) => {
    obj[item[key]] = value ? item[value] : item;
  });
  return obj;
};
