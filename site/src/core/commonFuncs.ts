import { ResponseCommon, ResponseError, ResponseType } from '@const/types';
import { NextApiResponse } from 'next';

/**
 * @param  {string} str
 */
export const isUrl = (str: string) =>
  /^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g.test(str);

/**
 * @returns boolean
 */
export const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * @param  {number} total
 * @param  {} page=1
 * @param  {} pageSize=10
 */
export const getPaginate = (total: number, page = 1, pageSize = 10) => {
  const totalPages = Math.ceil(total / pageSize);

  let startPage: number;
  let endPage: number;
  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else if (page <= 3) {
    startPage = 1;
    endPage = 5;
  } else if (page + 2 >= totalPages) {
    startPage = totalPages - 4;
    endPage = totalPages;
  } else {
    startPage = page - 2;
    endPage = page + 2;
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // @ts-ignore
  const pages = [...Array(endPage + 1 - startPage).keys()]?.map((i) => startPage + i);

  return {
    total,
    page,
    pages,
    pageSize,
    startPage,
    endPage,
    totalPages,
    startIndex,
    endIndex,
  };
};

export const getIdYoutubeFromUrl = (url: string | undefined) => {
  const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return url ? regex.exec(url)?.[3] : '';
};

/**
 * @param  {any} obj
 * @returns any
 */
export const mapObjectToArray = (obj: any): any[] => {
  const arr: any = [];
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      arr.push({ key, value: obj[key] });
    }
  });
  return arr;
};

/**
 * @param  {ResponseResult} args?
 * @returns ResponseResult
 */
export const initResponseResult = (args?: ResponseType): ResponseType => ({
  data: null,
  insertId: null,
  rowsAffected: 0,
  ...(args as {}),
});

/**
 * @param  {Response} res
 * @param  {ResponseCommon} args?
 */
export const sendResponseSuccess = (res: NextApiResponse, args?: ResponseCommon) => {
  const response = {
    status: 200,
    success: true,
    message: 'OK',
    ...(args as {}),
    results: initResponseResult(args?.results),
  };
  return res.status(response.status).json(response);
};

/**
 * @param  {Response} res
 * @param  {ResponseError} args?
 */
export const sendResponseError = (res: NextApiResponse, args?: ResponseError) => {
  const response = {
    status: 500,
    success: false,
    message: 'Internal Server Error',
    errors: new Error(''),
    ...(args as {}),
  };
  return res.status(response.status).json(response);
};
