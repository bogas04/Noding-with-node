var config = require("./config.js");
var express = require('express');
var handlers = require('./handlers.js');
var api = require('./api.js');
var app = express();

// logger middleware
app.use(handlers.logger);
app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('multer')({ dest : '../data/' }));

// content delivery
app.use(express.static(config.paths['public']));
app.use(express.static(config.paths['data']));

// api
app.get("/api/v1/pictures.json", api.getPictures);
app.post("/api/v1/picture.json", api.postPicture);


// views
app.get('/about',handlers.about);
app.get("/", handlers.home);

app.listen(8080);
