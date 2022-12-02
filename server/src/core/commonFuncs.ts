import * as fs from 'fs';
import { join } from 'path';
import { FileUpload } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param  {number} length
 */
export const randomIntByLength = (length: number) => {
  return Math.random()
    .toString()
    .slice(2, length + 2);
};

/**
 * @param  {string} str
 */
export const generateSlug = (str: string) => {
  const rmTones = str
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
 * @param  {FileUpload} file
 * @param  {} folder='uploads'
 */
export const readFileStream = (file: FileUpload, folder = 'uploads') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const pathDir = join(process.cwd(), 'public', folder, `${year}/${month}/${day}`);

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir, { recursive: true });
  }

  const stream = file.createReadStream();
  const filename = `${uuidv4()}.${file.filename.split('.').pop()}`;
  const pathname = join(pathDir, filename);
  const pathfile = join(`/${folder}`, `${year}/${month}/${day}`, filename).replace(/\\/g, '/');

  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(pathname))
      .on('finish', () => {
        const { size } = fs.statSync(pathname);
        resolve({ size, filename, pathname, pathfile });
      })
      .on('error', reject),
  );
};

export const writeFileStream = (buffer: Buffer, extension: string, folder = 'uploads') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const pathDir = join(process.cwd(), 'public', folder, `${year}/${month}/${day}`);

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir, { recursive: true });
  }

  const filename = `${uuidv4()}.${extension}`;
  const pathname = join(pathDir, filename);
  const pathfile = join(`/${folder}`, `${year}/${month}/${day}`, filename).replace(/\\/g, '/');

  fs.writeFileSync(pathname, buffer);
  const { size } = fs.statSync(pathname);
  return { size, filename, pathname, pathfile };
};
