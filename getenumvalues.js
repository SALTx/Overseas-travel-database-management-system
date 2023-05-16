module.exports = function getEnumValues(connection, table, column, callback) {
  const query = `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
                   WHERE TABLE_NAME = '${table}'
                   AND COLUMN_NAME = '${column}'`;

  connection.query(query, (error, results) => {
    if (error) {
      callback(error, null);
      return;
    } else {
      const values = results[0].COLUMN_TYPE.replace("enum(", "")
        .replace(")", "")
        .split(",");
      const enumValues = values.map((value) => value.replace(/'/g, "").trim());
      callback(null, enumValues);
    }
  });
};
