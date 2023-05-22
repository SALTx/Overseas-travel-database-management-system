const XLSX = require("xlsx");

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

function importFile(element, requriedHeaders) {
  const file = element[0].files[0];
  const filetype = file.name.split(".").pop().toLower();

  if (filetype == "csv") {
    importCSVFile(element, requiredHeaders);
  } else if (filetype == "xlsx") {
    importXLSXFile(element, requiredHeaders);
  } else if (filetype == "xml") {
  } else if (filetype == "json") {
  } else {
    throw new Error("Invalid import filetype provided: " + filetype);
  }
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
      resolve(map);
    };

    reader.onerror = function () {
      reject(new Error("Error occurred while reading the file."));
    };

    reader.readAsArrayBuffer(file);
  });
}
