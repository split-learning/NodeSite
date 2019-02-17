var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + "/views/";

app.use("/", router);
app.use(express.static('public'));

router.get("/", function (req, res) {
	res.sendFile(path + "HomePage/HomePage.html");
});

router.get("/video/", function (req, res) {
	res.sendFile(path + "VideoPage/VideoPage.html");
});

router.get("/category", function (req, res) {
	res.sendFile(path + "CategoryPage/CategoryPage.html");
});

app.use("*", function (req, res) {
	res.sendFile(path + "error-404.html");
});

app.listen(3000, function () {
	console.log("Server running at Port 3000");
});
