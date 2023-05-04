const express = require("express");
const router = express.Router();

router.get("/js/*", (req, res) => {
  let path = __dirname + "/views/" + req.url;
  res.sendFile(path);
});
router.get("/css/*", (req, res) => {
  let path = __dirname + "/views/" + req.url;
  res.sendFile(path);
});

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
