// GLOBAL
let data;

const studentHeaders = [
  "adminNo",
  "name",
  "gender",
  "citizenshipStatus",
  "course",
  "stage",
  "pemGroup",
];
const overseasProgramHeaders = [
  "programID",
  "programName",
  "programType",
  "startDate",
  "endDate",
  "countryCode",
  "city",
  "organization",
  "organizationType",
  "gsmCode",
  "gsmName",
];
const tripHeaders = ["studentAdminNo", "programID", "comments"];

function importFile(element, requiredHeaders) {
  const file = element[0].files[0];
  const filetype = file["name"].split(".")[1];

  if (filetype == "csv") {
    importCSVFile(element, requiredHeaders);
  } else if (filetype == "xlsx") {
    importXLSXFile(element, requiredHeaders);
  } else if (filetype == "xml") {
    importXMLFile(element, requiredHeaders);
  } else if (filetype == "json") {
    importJSONFile(element, requiredHeaders);
  } else {
    throw new Error("Invalid import filetype provided: " + file.name);
  }

  generateSQLStatement(data);
}

function importCSVFile(element, requiredHeaders) {
  const file = element[0].files[0];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const fileContent = reader.result;

      const lines = fileContent.replace(/\r/g, "").split("\n");
      const headers = lines[0].split(",");

      for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
          reject(new Error(`Required header '${header}' not found.`));
          return;
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

      console.log(map);
      data = map;
      resolve(map);
    };

    reader.onerror = function () {
      reject(new Error("Error occurred while reading the file."));
    };

    reader.readAsText(file);
  });
}

function importXLSXFile(element, requiredHeaders) {
  const file = element[0].files[0];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const data = new Uint8Array(reader.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = sheetData[0];

      for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
          reject(new Error(`Required header '${header}' not found.`));
          return;
        }
      }

      const map = sheetData.slice(1).map((values) => {
        const obj = {};
        headers.forEach((header, i) => {
          if (requiredHeaders.includes(header)) {
            obj[header] = values[i];
          }
        });
        return obj;
      });

      console.log(map);
      data = map;
      resolve(map);
    };

    reader.onerror = function () {
      reject(new Error("Error occurred while reading the file."));
    };

    reader.readAsArrayBuffer(file);
  });
}

function importXMLFile(element, requiredHeaders) {
  const file = element[0].files[0];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const fileContent = reader.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(fileContent, "application/xml");

      const headers = Array.from(xmlDoc.getElementsByTagName("*"))
        .map((node) => node.tagName)
        .filter((tagName, index, self) => self.indexOf(tagName) === index);

      for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
          reject(new Error(`Required header '${header}' not found.`));
          return;
        }
      }

      const records = Array.from(xmlDoc.getElementsByTagName("record"));
      const map = records.map((record) => {
        const obj = {};
        Array.from(record.children).forEach((child) => {
          if (requiredHeaders.includes(child.tagName)) {
            obj[child.tagName] = child.textContent;
          }
        });
        return obj;
      });

      console.log(map);
      data = map;
      resolve(map);
    };

    reader.onerror = function () {
      reject(new Error("Error occurred while reading the file."));
    };

    reader.readAsText(file);
  });
}

function importJSONFile(element, requiredHeaders) {
  const file = element[0].files[0];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const fileContent = reader.result;
      let jsonData;

      try {
        jsonData = JSON.parse(fileContent);
      } catch (error) {
        reject(new Error("Error occurred while parsing JSON file."));
        return;
      }

      const headers = Object.keys(jsonData[0]);

      for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
          reject(new Error(`Required header '${header}' not found.`));
          return;
        }
      }

      const map = jsonData.map((data) => {
        const obj = {};
        for (const header of requiredHeaders) {
          obj[header] = data[header];
        }
        return obj;
      });

      console.log(map);
      data = map;
      resolve(map);
    };

    reader.onerror = function () {
      reject(new Error("Error occurred while reading the file."));
    };

    reader.readAsText(file);
  });
}

// example data to be converted into sql statement
/*
[
  {
    adminNo: 'U1234567A',
    name: 'John Doe',
    gender: 'Male',
    citizenshipStatus: 'Singaporean',
    course: 'Diploma in Business',
    stage: 'Year 1',
    pemGroup: 'P1'
  }
]*/

function generateSQLStatement(data) {
  const sqlStatement = [];
  for (const record of data) {
    const keys = Object.keys(record);
    const values = Object.values(record);
    const sql = `INSERT INTO student (${keys.join(
      ", "
    )}) VALUES ('${values.join("', '")}');`;
    sqlStatement.push(sql);
  }
  console.log(sqlStatement);
  return sqlStatement;
}
