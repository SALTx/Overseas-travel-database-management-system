const express = require("express");
const router = express.Router();
const getEnumValues = require("../getenumvalues");

const connection = require("../database");

router.get("/", (req, res) => {
  let query = "SELECT * FROM overseasprograms";
  let programTypes, organizationTypes;
  getEnumValues(
    connection,
    "overseasprograms",
    "programType",
    (err, result) => {
      if (err) throw err;
      programTypes = result;
    }
  );
  getEnumValues(
    connection,
    "overseasprograms",
    "organizationType",
    (err, result) => {
      if (err) throw err;
      organizationTypes = result;
    }
  );
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.render("programs", {
      programs: result,
      programTypes: programTypes,
      organizationTypes: organizationTypes,
    });
  });
});

router.get("/:programId", (req, res) => {
  let query = "SELECT * FROM overseasprograms WHERE programId = ?";
  let programTypes, organizationTypes;
  getEnumValues(
    connection,
    "overseasprograms",
    "programType",
    (err, result) => {
      if (err) throw err;
      programTypes = result;
    }
  );
  getEnumValues(
    connection,
    "overseasprograms",
    "organizationType",
    (err, result) => {
      if (err) throw err;
      organizationTypes = result;
    }
  );
  connection.query(query, [req.params.programId], (err, result) => {
    if (err) throw err;
    res.render("edit", {
      column: "overseasprograms",
      program: result[0],
      programTypes: programTypes,
      organizationTypes: organizationTypes,
    });
  });
});

module.exports = router;
