var fs = require('fs')
var config = require('./config.js');

var response = {
  write : function writeResponse(res, code, respObj) {
    res.writeHead(code, { 'Content-Type' : 'application/json', 'Content-Encoding' : 'utf8'});
    console.log(respObj);
    res.end(JSON.stringify(respObj));
  },
  set : function setAPIResponse(err, code, msg, data) {
    return {
      "error" : err,
      "code" : code,
      "msg" : msg,
      "data" : data
    };
  }
};

function getHelp(api) {
  switch(api) {
    case 'pictures' : 
      return {
        "Title" : "API Ref | Get Pictures - Nodestagram",
        "Response" :  response.set(
          false,
          200,  
          "Message", 
          [ { "time" : new Date().getTime(), "user" : "bogas04", "url" : "img1.jpg" } ]
        ),
        "Parameters" : {
          "user" : {
            "optional" : true,
            "desc" : "Returns all pictures (max 20) from given user",
            "example" : "For eg : " +
                        "http://" + config.currentAPI + "pictures.json?user=bogas04"
          },
          "startTime" : {
            "optional" : true,
            "desc" :   "Filters pictures which are taken after given the given time" +
                        " in milliseconds since 1, Jan, 1970.",
            "example" : " For eg : " +
                        " http://" + config.currentAPI + "pictures.json?startTime="+ (new Date().getTime())
           },
      
           "endTime" : {
            "optional" : true,
            "desc" :    "Filters pictures which are taken before the given time" +
                        " in milliseconds since 1, Jan, 1970.",
            "example" : " For eg : " +
                        " http://" + config.currentAPI + "pictures.json?endTime="+ (new Date().getTime())
          },
      
          "startPage" : {
            "optional" : true,
            "desc" :    "Filters pictures which are taken after given parameter th picture.",
            "example" : " For eg this will return (max 20) pictures after 10th picture uploaded on server : " +
                        " http://" + config.currentAPI + "pictures.json?startPage=10"
          },
          "pageSize" : {
            "optional" : true,
            "desc" :    "Shows given parameter pictures in total. (max 20)",
            "example" : " For eg : " +
                        " http://" + config.currentAPI + "pictures.json?pageSize=12"
         }
       }
    };
    break;  
  }
}

/**************************
   GET /pictures.json
**************************/

function getPictures(res, _settings) {
  var settings = {
    pageStart : 0,
    pageSize : 20,
    startTime : new Date().getTime() - 1000*60*60*24*14, // 2 weeks ago
    endTime : new Date().getTime(),
    user : null
  };

  // Changing settings
  for(var i in _settings) {
    if(typeof settings[i] !== "undefined") {
      settings[i] = _settings[i];
    }
  }

  // Get the photos from data/photos/
    // TODO : get the file list from Mongo DB
   
  fs.readdir(config.paths['data'], function(err, files) {
    if(!files || files.length == 0) {
      response.write(res, 200, response.set(true, 404, "No files uploaded", null));
    } else {

      if(settings.pageStart > files.length) {
        settings.pageStart = 0;
      }
      
      files.sort();
      // filtering data
      var result = [];
      for(var i in files) {
        var fileData = files[i].split('-');
        var timeStamp = fileData[0];
       
       if(timeStamp > settings.startTime && timeStamp < settings.endTime) {
          var till = ((i + settings.pageSize) > files.length) ? files.length : (i + settings.pageSize);
          for(var j = i; j < till; j++) {
      
              var fileData = files[j].split('-');
              var timeStamp = fileData[0];
              var user = fileData[1].replace(/\.[a-zA-Z]+$/i,"");
      
              if((settings.user != null && user == settings.user) || settings.user == null) {
                result.push({
                  "time" : timeStamp,
                  "user" : user,
                  "url"  : files[j]
                });
              }
          }
          break;
        }
      }
    
      // printing result  
      if(result.length == 0) {
        response.write(res, 200, response.set(true, 404, "No files found with given parameters" , null));
      } else {
        response.write(res, 200, response.set(false, 200, result.length + " files found", result));
      }    
    }
  });
}

exports.getPictures = function (req, res) {
  if(req.query.help == 1) {
    response.write(res, 200, response.set(false, 200, "Read the data for API help", getHelp('pictures')));
    return;
  }  

  var settings = {};
  if(typeof req.query.user !== "undefined" && req.query.user != "null" && req.query.user != "")  { 
    settings['user'] = req.query.user;
  } 
  if(typeof req.query.startTime !== "undefined" && !isNaN(req.query.startTime)) { 
    settings['startTime'] = req.query.startTime;
  } 
  if(typeof req.query.endTime !== "undefined" && !isNaN(req.query.endTime)) { 
    settings['endTime'] = req.query.endTime;
  } 
  if(typeof req.query.pageStart !== "undefined" && !isNaN(req.query.pageStart)) { 
    settings['pageStart'] = req.query.pageStart;
  } 
  if(typeof req.query.pageSize !== "undefined" && !isNaN(req.query.pageSize)) { 
    settings['pageSize'] = req.query.pageSize;
  }
  getPictures(res, settings); 
}
exports.postPicture = function (req, res) {
  var time = new Date().getTime();
  var userName = req.param('userName');
  var supportedType = ["png", "bmp", "jpeg", "jpg"];
  var file = req.files.imageFile;
  var ext = file.extension.toLowerCase();
  var path = config.paths.data + time + '-' + userName + '.' + ext;
  if(/^[a-z_]{1}[a-z_0-9\-]+$/.test(userName)) {
  
    if(supportedType.indexOf(ext) > -1) {
      fs.rename(file.path, path, function(err, cb) {
        console.log("Renaming " +file.path+ " > "+ path);
        if(err) {
          // report to admin
          console.log("WARNING : Couldn't rename file");
          response.write(res, 200, response.set(503, true, "Couldn't save the file"));
        } else {
          console.log("Renamed !");
          response.write(res, 200, response.set(200, false, "File saved!"));
        }
        
      });
    
    } else { // bad file type
    
      fs.unlink(req.files.imageFile.path, function(err, cb) {
        if(err) {
          // report to admin
          console.log("WARNING : Couldn't delete file");
        } 
        response.write(res, 200, response.set(400, true, "Bad file type"));
      }); 
      
    }
 
  } else { // bad username
  
    fs.unlink(req.files.imageFile.path, function(err, cb) {
      if(err) {
        // report to admin
        console.log("WARNING : Couldn't delete file");
      } 
      response.write(res, 200, response.set(400, true, "Bad username."));
    }); 
  }
}
