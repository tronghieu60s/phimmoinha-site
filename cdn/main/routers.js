const router = require("express-promise-router")();

router.use("/uploads", require("./uploads/uploads.routers"));
router.get("/500", () => {
  throw {};
});

module.exports = router;
