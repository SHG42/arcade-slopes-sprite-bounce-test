var express = require("express"),
  app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(8080, () => {
  console.log("Welcome to hell");
});
