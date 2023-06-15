const getEnumValues = require("./getenumvalues");
const express = require("express");
const router = express.Router();

const connection = require("./database");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

// for all routes, set csp header
router.use((req, res, next) => {
  res.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'self'"
  );
  next();
});

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

// route not found, redirect to error page
// router.get("*", (req, res) => {
//   const path = req.path;
//   if (path.includes("/css") || path.includes("/js")) return;
//   console.log(`[${new Date().toUTCString()}] ${req.path}`);
//   res.render("error", {
//     title: "Error",
//     error: "404",
//     message: "Page not found",
//   });
// });

module.exports = router;
