function importFile(type) {
  console.log($("#uploadedFile").files);
  let file = document.getElementById("#uploadedFile").files;
  if (file == null) {
    console.log("Error: No file selected");
    return;
  }

  if (type == "CSV") {
    importFromCSV(file);
  } else if (type == "XLS") {
  } else if (type == "JSON") {
  } else if (type == "XML") {
  } else {
    console.log("Error: Invalid file type");
  }
}

function importFromCSV(file) {
  //   console.log file contents
  let reader = new FileReader();
  reader.onload = function (e) {
    console.log(e.target.result);
  };
  reader.readAsText(file);
}

function readFile() {
  $(document).ready(function () {
    $("#readFile").click(function () {
      var file = $("#uploadedFile")[0].files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        var contents = e.target.result;
        console.log(contents);
      };

      reader.readAsText(file);
    });
  });
}
