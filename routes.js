const getEnumValues = require("./getenumvalues");
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

router.get("/students", (req, res) => {
  let query = "SELECT * FROM students";
  getEnumValues(connection, "students", "gender", (err, genders) => {
    if (err) {
      throw err;
    }
    getEnumValues(
      connection,
      "students",
      "citizenshipStatus",
      (err, citizenshipStatuses) => {
        connection.query(query, (err, result) => {
          if (err) {
            throw err;
          }
          res.render("students", {
            students: result,
            genders: genders,
            citizenshipStatuses: citizenshipStatuses,
          });
        });
      }
    );
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
  let query = "INSERT INTO students VALUES (?,?,?,?,?,?,?)";
  connection.query(
    query,
    [
      data.adminNo,
      data.name,
      data.gender,
      data.citizenshipStatus,
      data.course,
      data.stage,
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
    res.status(200).send("success");
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

// programs

router.get("/programs", (req, res) => {
  let query = "SELECT * FROM programs";
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.render("programs", { programs: result });
  });
});

module.exports = router;
