// const express = require("express");
// const router = express.Router();
// const getEnumValues = require("../getenumvalues");

// const connection = require("../database");

// router.get("/", (req, res) => {
//     let query = "SELECT * FROM overseasPrograms";
//     getEnumValues(connection, "programs", "programType", (err, programTypes) => {
//         if (err) {
//             throw err;
//         }
//         getEnumValues(
//             connection,
//             "programs",
//             "organizationType",
//             (err, organizationTypes) => {
//                 if(err) throw err;

// module.exports = router;
