const express = require("express");
const app = express();
const routes = require("./routes");
const studentRoutes = require("./routes/students");
const programRoutes = require("./routes/programs");
const recordsRoutes = require("./routes/records");
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", routes);
app.use("/students", studentRoutes);
app.use("/programs", programRoutes);
app.use("/records", recordsRoutes);

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
