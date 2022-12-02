const fs = require("fs");
const { join, extname } = require("path");
const mime = require("mime-types");
const { sendResponseSuccess } = require("../../core/commonFuncs");

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 10;

const uploads = (req, res) => {
  const {
    page = 1,
    pageSize = Number(APP_LIMIT_PAGINATION),
    path = "",
  } = req.query;

  let files = [];
  let items = [];
  try {
    files = fs
      .readdirSync(join(process.cwd(), "public", path))
      .filter((o) => o !== ".gitkeep");
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    items = files.slice(start, end)?.map((file) => {
      const stats = fs.statSync(join(process.cwd(), "public", path, file));
      return {
        size: stats.size,
        path: `/${join(path, file).replace(/\\/g, "/")}`,
        filename: file,
        mimetype: mime.lookup(extname(file)),
      };
    });
  } catch (error) {}

  const total = files.length;
  const pageTotal = Math.ceil(total / pageSize);
  const nextPage = page >= pageTotal ? null : page + 1;
  const previousPage = page <= 1 ? null : page - 1;

  const data = {
    items,
    pagination: {
      total,
      page,
      pageSize,
      pageTotal,
      nextPage,
      previousPage,
    },
  };

  return sendResponseSuccess(res, { results: { data } });
};

const createUpload = (req, res) => {
  const file = req.file;
  const path = file.path.replace(process.cwd(), "").replace(/\\/g, "/");
  const data = {
    size: file.size,
    path,
    filename: file.filename,
    mimetype: file.mimetype,
  };
  return sendResponseSuccess(res, { results: { data } });
};

const deleteUpload = (req, res) => {
  const { path, forceDelete = false } = req.body;
  const filePath = join(process.cwd(), "public", path);
  if (fs.lstatSync(filePath).isDirectory()) {
    fs.rmdirSync(filePath, { recursive: forceDelete });
  } else if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return sendResponseSuccess(res, { results: { data: true } });
};

module.exports = { uploads, createUpload, deleteUpload };
