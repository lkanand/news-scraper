var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./controllers/news-routes.js")(app);

var PORT = process.env.PORT || 8000;

mongoose.Promise = Promise;

if(process.env.MONGODB_URI)
	mongoose.connect(process.env.MONGODB_URI);
else
	mongoose.connect("mongodb://localhost/news-scraper");

app.listen(PORT, function() {
	console.log("App listening on port " + PORT);
});

