const express = require("express");
const app = express();
const routes = require("./routes");
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
