module.exports = async function getEnumValues(connection, table, column) {
  const util = require("util");
  const queryAsync = util.promisify(connection.query).bind(connection);

  const query = `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_NAME = '${table}'
                 AND COLUMN_NAME = '${column}'`;

  try {
    const results = await queryAsync(query);
    if (results.length === 0) {
      throw new Error("No results found for query");
    }
    const values = results[0].COLUMN_TYPE.replace("enum(", "")
      .replace(")", "")
      .split(",");
    const enumValues = values.map((value) => value.replace(/'/g, "").trim());
    return enumValues;
  } catch (error) {
    throw error;
  }
};
