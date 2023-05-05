const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "overseas-travel",
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
  res.render("index");
});

// Students
router.get("/students", (req, res) => {
  let query = "SELECT * FROM students";
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.render("students", { students: result });
  });
});

router.get("/api/students", (req, res) => {
  let query = "SELECT * FROM students";
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/students", (req, res) => {
  const data = req.body;

  let adminNo = data.adminNo;
  let name = data.name;
  let gender = data.gender;
  let birthday = data.birthday;
  let citizenshipStatus = data.citizenshipStatus;
  let countryOfOrigin = data.countryOfOrigin;
  let course = data.course;
  let year = data.year;
  let pemGroup = data.pemGroup;

  let query = "INSERT INTO students VALUES (?,?,?,?,?,?,?,?,?)";
  connection.query(
    query,
    [
      adminNo,
      name,
      gender,
      birthday,
      citizenshipStatus,
      countryOfOrigin,
      course,
      year,
      pemGroup,
    ],
    (err, result) => {
      if (err) throw err;
      res.redirect("/students");
    }
  );
});

module.exports = router;
