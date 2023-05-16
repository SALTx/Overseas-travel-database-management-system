const express = require("express");
const router = express.Router();
const getEnumValues = require("../getenumvalues");

const connection = require("../database");

router.get("/", (req, res) => {
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
            title: "Students",
            students: result,
            genders: genders,
            citizenshipStatuses: citizenshipStatuses,
          });
        });
      }
    );
  });
});

// Edit students page
router.get("/:adminNo", (req, res) => {
  let query = "SELECT * FROM students WHERE adminNo = ?";
  let genders, citizenshipStatuses;
  getEnumValues(connection, "students", "gender", (err, result) => {
    if (err) throw err;
    genders = result;
  });
  getEnumValues(connection, "students", "citizenshipStatus", (err, result) => {
    if (err) throw err;
    citizenshipStatuses = result;
  });
  connection.query(query, [req.params.adminNo], (err, result) => {
    if (err) throw err;
    res.render("edit", {
      column: "students",
      student: result[0],
      genders: genders,
      citizenshipStatuses: citizenshipStatuses,
    });
  });
});

router.post("/", (req, res) => {
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
      res.redirect("");
    }
  );
});

router.post("/:adminNo", (req, res) => {
  let query = "Update students SET ? WHERE adminNo = ?";
  connection.query(query, [req.body, req.params.adminNo], (err, result) => {
    if (err) throw err;
    res.redirect("");
  });
});

router.delete("/:adminNo", (req, res) => {
  const adminNo = req.params.adminNo;
  let query = "DELETE FROM students WHERE adminNo = ?";
  connection.query(query, [adminNo], (err, result) => {
    if (err) throw err;
    res.status(200).send("success");
  });
});

router.put("/:adminNo", (req, res) => {
  const adminNo = req.params.adminNo;
  const data = req.body;
  let query = "UPDATE students SET ? WHERE adminNo = ?";
  connection.query(query, [data, adminNo], (err, result) => {
    if (err) throw err;
    res.redirect("");
  });
});

module.exports = router;
