const getEnumValues = require("./getenumvalues");
const express = require("express");
const router = express.Router();

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
