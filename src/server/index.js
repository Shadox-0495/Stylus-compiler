var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.listen(process.env.PORT || 80, () => {
	console.log(`Server listening on port ${PORT}!`);
});
