const express = require("express");
const app = express();
const routes = require("./routes");
const studentRoutes = require("./routes/students");
const programRoutes = require("./routes/programs");
const recordsRoutes = require("./routes/records");
const importfilesRoutes = require("./routes/importfiles");
const fileUpload = require("express-fileupload");
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/", routes);
app.use("/students", studentRoutes);
app.use("/programs", programRoutes);
app.use("/records", recordsRoutes);
app.use("/functions/import", importfilesRoutes);

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
