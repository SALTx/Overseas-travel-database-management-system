/*
Programs table
ProgramID char(5)
programName varchar(64)
programType = ENUM
startDate date
endDate date
countryCode char(2)
city varchar(64)
organisationType ENUM
*/

const express = require("express");
const router = express.Router();
const getEnumValues = require("../getenumvalues");

const connection = require("../database");
const util = require("util");
const queryAsync = util.promisify(connection.query).bind(connection);

// Programs home page
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM overseasprograms";
    const programTypesPromise = getEnumValues(
      connection,
      "overseasprograms",
      "programType"
    );
    const organizationTypesPromise = getEnumValues(
      connection,
      "overseasprograms",
      "organizationType"
    );

    const [programTypes, organizationTypes, result] = await Promise.all([
      programTypesPromise,
      organizationTypesPromise,
      queryAsync(query),
    ]);

    res.status(200).render("programs", {
      title: "Programs",
      programs: result,
      programTypes,
      organizationTypes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Edit programs page
router.get("/:programID", async (req, res) => {
  try {
    const programID = req.params.programID;
    const query = "SELECT * FROM overseasprograms WHERE programID = ?";
    const [programTypes, organizationTypes, result] = await Promise.all([
      getEnumValues(connection, "overseasprograms", "programType"),
      getEnumValues(connection, "overseasprograms", "organizationType"),
      queryAsync(query, [programID]),
    ]);

    res.status(200).render("edit", {
      column: "overseasprograms",
      program: result[0],
      programTypes,
      organizationTypes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add programs into database
router.post("/", (req, res) => {
  const data = req.body;
  const query = "INSERT INTO overseasprograms VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [
      data.programID,
      data.programName,
      data.programType,
      data.startDate,
      data.endDate,
      data.countryCode,
      data.city,
      data.organization,
      data.organizationType,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).redirect("/programs");
      }
    }
  );
});

// Update programs in database
router.post("/:programID", (req, res) => {
  const programID = req.params.programID;
  const query = "UPDATE overseasprograms SET ? WHERE programID = ?";
  connection.query(query, [req.body, programID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).redirect("/programs");
    }
  });
});

router.delete("/:programID", (req, res) => {
  const programID = req.params.programID;
  const query = "DELETE FROM overseasprograms WHERE programID = ?";
  connection.query(query, [programID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("success");
    }
  });
});

module.exports = router;
