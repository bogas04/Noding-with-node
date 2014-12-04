var config = require('./config.js');
var fs = require('fs');


function about(req, res) {
  fs.readFile(config.paths.public + "about.html", function (err, data) {
    if(err) {
      console.log(err);
      config.errors.write(404, res);
    } else {
      res.writeHead(200, {
        "Content-Type" : "text/html"
      });
      res.end(data);
    }
  });
}

function home(req, res) {
  fs.readFile(config.paths.public + "home.html", function (err, data) {
    if(err) {
      console.log(err);
      config.errors.write(404, res);
    } else {
      res.writeHead(200, {
        "Content-Type" : "text/html"
      });
      res.end(data);
    }
  });
}


function logger(req, res, next) {
  console.log("[" + req.method + "]" + " " + req.url);
  next();
}
exports.home = home;
exports.about = about;
exports.logger = logger;
