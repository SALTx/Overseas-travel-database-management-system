require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

// Routes
const routes = require("./routes");
const studentRoutes = require("./routes/students");
const programRoutes = require("./routes/programs");
const recordsRoutes = require("./routes/records");

// Config Server
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static("public"));

app.use("/", routes);
app.use("/students", studentRoutes);
app.use("/programs", programRoutes);
app.use("/records", recordsRoutes);

// Serve static files from the "views" directory
app.use("/js", express.static(__dirname + "/views/js"));
app.use("/css", express.static(__dirname + "/views/css"));

app.listen(process.env.PORT, () => {
  console.log(`Server runnong on port ${process.env.PORT}`);
});
