const fs = require("fs");
const XLSX = require("xlsx");
const xml2js = require("xml2js");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "overseas-travel",
});

function parseJSONFile(filePath, requiredHeaders) {
  const data = fs.readFileSync(filePath, "utf8");
  const jsonData = JSON.parse(data);

  // Extract the required headers from each object in the JSON array
  const extractedData = jsonData.map((item) => {
    const filteredItem = {};
    for (const header of requiredHeaders) {
      if (!(header in item)) {
        throw new Error(`Required header '${header}' not found in JSON.`);
      }
      filteredItem[header] = item[header];
    }
    return filteredItem;
  });

  return extractedData;
}

// (REQUIRES) parseString from xml2js npm package
// (TESTED) works
function parseXMLFile(filePath, requiredHeaders) {
  const data = fs.readFileSync(filePath, "utf8");
  let jsonData = null;

  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(data, (error, result) => {
    if (error) {
      throw new Error(`Failed to parse XML file: ${error}`);
    }
    if (requiredHeaders) {
      const records = result["student-data"]["record"];
      const filteredResult = records.map((record) => {
        const filteredRecord = {};

        for (const key of requiredHeaders) {
          if (key in record) {
            filteredRecord[key] = record[key];
          } else {
            throw new Error(`Required header '${key}' not found in XML.`);
          }
        }

        return filteredRecord;
      });

      jsonData = filteredResult;
    } else {
      jsonData = result;
    }
  });

  return jsonData;
}

// (REQUIRES) xlsx npm package
// (TESTED) works
function parseXLSFile(filePath, requiredHeaders) {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);

  const headers = Object.keys(data[0]);

  // make sure all required headers are present and in the specified order
  for (let i = 0; i < requiredHeaders.length; i++) {
    const header = requiredHeaders[i];
    if (!headers.includes(header)) {
      throw new Error(`Required header '${header}' not found.`);
    }
    // validation to make sure its in order
    // if (headers.indexOf(header) !== i) {
    //   throw new Error(`Header '${header}' is not in the specified order.`);
    // }
  }

  const map = data.map((row) => {
    const obj = {};
    headers.forEach((header) => {
      if (requiredHeaders.includes(header)) {
        obj[header] = row[header];
      }
    });
    return obj;
  });

  return map;
}

// (TESTED) WORKS
function parseCSVFile(filePath, requiredHeaders) {
  let data = fs.readFileSync(filePath, "utf8").replace(/\r/g, "");

  // convert the data into a map based on the first line
  const lines = data.split("\n");
  const headers = lines[0].split(",");

  // make sure all required headers are present
  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`Required header '${header}' not found.`);
    }
  }

  const map = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((header, i) => {
      if (requiredHeaders.includes(header)) {
        obj[header] = values[i];
      }
    });
    return obj;
  });

  return map;
}

// IMCOMPLETE
function generateSQL(data, tableName) {
  const headers = Object.keys(data[0]);

  // check if the headers are valid by referencing its table in the connection object
  const table = connection.config.tables.find(
    (table) => table.name === tableName
  );
  if (!table) {
    throw new Error(`Table '${tableName}' not found in database.`);
  }

  const sql = `INSERT IGNORE INTO ${tableName} (${headers.join(
    ", "
  )}) VALUES\n`;

  const values = data.map((row) => {
    const rowValues = headers.map((header) => {
      const value = row[header];
      if (typeof value === "string") {
        return `'${value}'`;
      }
      return value;
    });
    return `(${rowValues.join(", ")})`;
  });

  return sql + values.join(",\n") + ";";
}

module.exports = {
  parse: {
    csv: parseCSVFile,
    xls: parseXLSFile,
    xml: parseXMLFile,
    json: parseJSONFile,
  },
  sql: {
    generate: generateSQL,
  },
};

// /** TESTING. REQUIRES DIR './data/data.{filetype} **/

// // example usage (CSV)
// console.log("Printing CSV data");
// const requiredHeadersCSV = ["adminNo", "name", "gender"];
// const filePathCSV = "./data/data.csv";
// const mapCSV = parseCSVFile(filePathCSV, requiredHeadersCSV);
// console.log(mapCSV);

// console.log("--------------------\n\n");

// // example usage (XLS)
// console.log("Printing XLS data");
// const requiredHeadersXLS = ["adminNo", "name", "gender"];
// const filePathXLS = "./data/data.xlsx";
// const mapXLS = parseXLSFile(filePathXLS, requiredHeadersXLS);
// console.log(mapXLS);

// console.log("--------------------\n\n");

// // Example usage (XML)
// console.log("Printing XML data");
// const filePathXML = "./data/data.xml";
// const requiredHeadersXML = ["name", "adminNo", "gender"];
// const jsonDataXML = parseXMLFile(filePathXML, requiredHeadersXML);
// console.log(jsonDataXML);

// console.log("--------------------\n\n");

// // Example usage (JSON)
// console.log("Printing JSON data");
// const filePathJSON = "./data/data.json";
// const requiredHeadersJson = ["name", "adminNo", "gender"];
// const jsonDataJSON = parseJSONFile(filePathJSON, requiredHeadersJson);
// console.log(jsonDataJSON);

// console.log("--------------------\n\n");
