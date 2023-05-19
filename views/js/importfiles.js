function importCSVFile(element, requiredHeaders) {
  console.log(element);
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
