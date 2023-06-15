require("dotenv").config();
const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const getEnumValues = async function getEnumValues(connection, table, column) {
  const queryAsync = util.promisify(connection.query).bind(connection);

  const query = `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_NAME = '${table}'
                 AND COLUMN_NAME = '${column}'`;

  try {
    const results = await queryAsync(query);
    const values = results[0].COLUMN_TYPE.replace("enum(", "")
      .replace(")", "")
      .split(",");
    const enumValues = values.map((value) => value.replace(/'/g, "").trim());
    return enumValues;
  } catch (error) {
    throw error;
  }
};

const getTables = async function getTables(connection) {
  const queryAsync = util.promisify(connection.query).bind(connection);

  const query = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
                  WHERE TABLE_TYPE = 'BASE TABLE'
                  AND TABLE_SCHEMA='${process.env.DATABASE_NAME}'`;

  try {
    const results = await queryAsync(query);
    const tables = results.map((result) => result.TABLE_NAME);
    return tables;
  } catch (error) {
    throw error;
  }
};

const getColumns = async function getColumns(connection, table) {
  const queryAsync = util.promisify(connection.query).bind(connection);

  const query = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_NAME = '${table}'
                  AND TABLE_SCHEMA='${process.env.DATABASE_NAME}'`;

  try {
    const results = await queryAsync(query);
    const columns = results.map((result) => result.COLUMN_NAME);
    return columns;
  } catch (error) {
    throw error;
  }
};

module.exports = connection;

/*
NEW MODULE EXPORTS
module.exports = {
  connection,
  utils: {
    getEnumValues,
    getTables,
    getColumns,
  }
}
*/
