const express = require("express");
const router = express.Router();
const getEnumValues = require("../getenumvalues");

const connection = require("../database");

router.get("/", (req, res) => {
  let query = "SELECT * FROM trips";
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.render("records", { trips: result });
  });
});

module.exports = router;
