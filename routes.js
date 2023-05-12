const getEnumValues = require("./getenumvalues");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = require("./database");

// FOR TESTING ONLY: REMOVE LATER
router.get("/enum/:table/:column", (req, res) => {
  getEnumValues(
    connection,
    req.params.table,
    req.params.column,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    }
  );
});

// Allow access to static js and css files
router.get("/js/*", (req, res) => {
  let path = __dirname + "/views/" + req.url;
  res.sendFile(path);
});
router.get("/css/*", (req, res) => {
  let path = __dirname + "/views/" + req.url;
  res.sendFile(path);
});

// Loads up home page
router.get("/", (req, res) => {
  let query =
    "Select name, count(trips.studentAdminNo) as numTrips from students left join trips on students.adminNo = trips.studentAdminNo group by students.adminNo order by numTrips desc limit 10";
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.render("index", {
      title: "Home",
      topTravelers: result || [],
    });
  });
});

module.exports = router;
