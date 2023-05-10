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

// Get all enum values
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

router.get("/students/:adminNo", (req, res) => {
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

router.post("/students/:adminNo", (req, res) => {
  let query = "Update students SET ? WHERE adminNo = ?";
  connection.query(query, [req.body, req.params.adminNo], (err, result) => {
    if (err) throw err;
    res.redirect("/students");
  });
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

router.get("/programs/:programId", (req, res) => {
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
