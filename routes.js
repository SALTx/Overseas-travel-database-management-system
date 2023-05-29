const getEnumValues = require("./getenumvalues");
const express = require("express");
const router = express.Router();

const connection = require("./database");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

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

  let kpi1query = "select * from kpi1";
  let kpi2query = "select * from kpi2";
  let kpi3query = "select * from kpi3";

  connection.query(query, (err, result) => {
    if (err) throw err;
    res.render("index", {
      title: "Home",
      topTravelers: result || [],
    });
  });
});

router.get("/universal/:table", async (req, res) => {
  const table = req.params.table;
  const query = `select * from ${table}`;

  const data = await queryAsync(query);

  res.render("universal", {
    title: "Universal test",
    table: table,
    data: data,
  });
});

module.exports = router;
