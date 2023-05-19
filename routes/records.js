/*
trips table
studentAdminNo char(7)
programId char(6)
comments text
*/
const express = require("express");
const router = express.Router();

const connection = require("../database");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

// Records home page
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM trips";
    const result = await queryAsync(query);

    res.status(200).render("records", {
      title: "Records",
      trips: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add record to database
router.post("/", (req, res) => {
  const data = req.body;
  const query = "INSERT INTO trips VALUES (?, ?, ?)";
  connection.query(
    query,
    [data.studentAdminNo, data.programId, data.comments],
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

// Update record in database
router.post("/:studentAdminNo/:programId", (req, res) => {
  const studentAdminNo = req.params.studentAdminNo;
  const programId = req.params.programId;
  const query = "UPDATE trips SET ? WHERE studentAdminNo = ? AND programId = ?";
  connection.query(
    query,
    [req.body, studentAdminNo, programId],
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

// Remove record from database
router.delete("/:studentAdminNo/:programId", (req, res) => {
  const studentAdminNo = req.params.studentAdminNo;
  const programId = req.params.programId;
  const query = "DELETE FROM trips WHERE studentAdminNo = ? AND programId = ?";
  connection.query(query, [studentAdminNo, programId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("success");
    }
  });
});

module.exports = router;
