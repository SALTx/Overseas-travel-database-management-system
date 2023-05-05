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
  let query = "INSERT INTO students VALUES (?,?,?,?,?,?,?,?,?)";
  connection.query(
    query,
    [
      data.adminNo,
      data.name,
      data.gender,
      data.birthday,
      data.citizenshipStatus,
      data.countryOfOrigin,
      data.course,
      data.year,
      data.pemGroup,
    ],
    (err, result) => {
      if (err) throw err;
      res.redirect("/students");
    }
  );
});

router.delete("/students/:adminNo", (req, res) => {
  const adminNo = req.params.adminNo;
  let query = "DELETE FROM students WHERE adminNo = ?";
  connection.query(query, [adminNo], (err, result) => {
    if (err) throw err;
    res.redirect("/students");
  });
});

router.put("/students/:adminNo", (req, res) => {
  const adminNo = req.params.adminNo;
  const data = req.body;
  let query = "UPDATE students SET ? WHERE adminNo = ?";
  connection.query(query, [data, adminNo], (err, result) => {
    if (err) throw err;
    res.redirect("/students");
  });
});

module.exports = router;
