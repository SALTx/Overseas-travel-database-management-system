const express = require("express");
const router = express.Router();
const getEnumValues = require("../getenumvalues");

const connection = require("../database");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

// Students home page
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM students";
    const gendersPromise = getEnumValues(connection, "students", "gender");
    const citizenshipStatusesPromise = getEnumValues(
      connection,
      "students",
      "citizenshipStatus"
    );

    const [genders, citizenshipStatuses, result] = await Promise.all([
      gendersPromise,
      citizenshipStatusesPromise,
      queryAsync(query),
    ]);

    res.status(200).render("students", {
      title: "Students",
      students: result,
      genders,
      citizenshipStatuses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Edit students page
router.get("/:adminNo", async (req, res) => {
  try {
    const query = "SELECT * FROM students WHERE adminNo = ?";
    const [genders, citizenshipStatuses, result] = await Promise.all([
      getEnumValues(connection, "students", "gender"),
      getEnumValues(connection, "students", "citizenshipStatus"),
      queryAsync(query, [req.params.adminNo]),
    ]);

    res.status(200).render("edit", {
      column: "students",
      student: result[0],
      genders,
      citizenshipStatuses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add students into database
router.post("/", (req, res) => {
  const data = req.body;
  const query = "INSERT INTO students VALUES (?,?,?,?,?,?,?)";
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
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).redirect("/");
      }
    }
  );
});

// Update students in database
router.post("/:adminNo", (req, res) => {
  const adminNo = req.params.adminNo;
  const query = "UPDATE students SET ? WHERE adminNo = ?";
  connection.query(query, [req.body, adminNo], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).redirect("/");
    }
  });
});

// Remove student from database
router.delete("/:adminNo", (req, res) => {
  const adminNo = req.params.adminNo;
  const query = "DELETE FROM students WHERE adminNo = ?";
  connection.query(query, [adminNo], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("success");
    }
  });
});

module.exports = router;
