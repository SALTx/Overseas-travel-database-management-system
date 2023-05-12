const getEnumValues = require("./getenumvalues");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = require("./database");

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

router.get("/js/*", (req, res) => {
  let path = __dirname + "/views/" + req.url;
  res.sendFile(path);
});
router.get("/css/*", (req, res) => {
  let path = __dirname + "/views/" + req.url;
  res.sendFile(path);
});

router.get("/", (req, res) => {
  // get each student and the number of trips theyve been on as seen by how many time their adminNo appears in the trips table
  let query =
    "Select name, count(trips.studentAdminNo) as numTrips from students left join trips on students.adminNo = trips.studentAdminNo group by students.adminNo order by numTrips desc limit 10";
  connection.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.render("index", { topTravelers: result });
  });
});

// programs

router.get("/records", (req, res) => {
  let query = "SELECT * FROM trips";
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.render("records", { trips: result });
  });
});

module.exports = router;
