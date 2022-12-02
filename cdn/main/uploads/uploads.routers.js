const fs = require("fs");
const multer = require("multer");
const { join, extname } = require("path");
const router = require("express-promise-router")();
const { v4: uuidv4 } = require("uuid");
const {
  uploads,
  createUpload,
  deleteUpload,
} = require("./uploads.controllers");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = extname(file.originalname);
    const filename = `${uuidv4()}.${ext}`;
    cb(null, filename);
  },
  destination: function (req, file, cb) {
    const { path } = req.params;

    if (file.mimetype.split("/")[0] !== "image") {
      return cb(new Error("ERROR_FILE_NOT_SUPPORTED"), null);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const pathDir = join(
      process.cwd(),
      "public",
      path || `${year}/${month}/${day}`
    );
    if (!fs.existsSync(pathDir)) {
      fs.mkdirSync(pathDir, { recursive: true });
    }

    cb(null, pathDir);
  },
});

const upload = multer({ storage: storage });

router.get("/", uploads);
router.post("/", upload.single("file"), createUpload);
router.delete("/", deleteUpload);

module.exports = router;
