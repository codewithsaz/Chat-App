const express = require("express");
const router = express.Router();

const upload = require("../helpers/upload.helper");
const uploadController = require("../controllers/upload");
const authenticator = require("../middlewares/authenticator");

router.post(
  "/chat/upload",
  authenticator.authenticate,
  upload.single("message"),
  uploadController.uploadSingle
);
// router.post(
//   "/upload-multiple",
//   upload.array("files", 5),
//   uploadController.uploadMultiple
// );

// /* ------------------------ upload and error handling ----------------------- */
// router.post("/upload-single-v2", uploadController.uploadSingleV2);

module.exports = router;
