import { sendResponseError, sendResponseSuccess } from '@core/commonFuncs';
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

const APP_PAGE_REVALIDATE_TOKEN = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TOKEN || '';

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function RevalidateHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  const { path, secret } = query;

  await runMiddleware(req, res, cors);

  if (!path) {
    return sendResponseError(res, { status: 400, message: 'path is required' });
  }

  if (secret !== APP_PAGE_REVALIDATE_TOKEN) {
    return sendResponseError(res, { status: 401, message: 'secret token is invalid' });
  }

  try {
    await res.revalidate(String(path));
    return sendResponseSuccess(res, { message: 'revalidated' });
  } catch (err) {
    return sendResponseError(res, { status: 500, message: 'error revalidate' });
  }
}
