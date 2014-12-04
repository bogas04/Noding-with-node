var errors = {
  "404" : {
    title : " 404 - File not found ",
    msg : " Opps! File not found :( "
  }, 
  "500" : { 
    title : " 500 - Internal Server Error ",
    msg : " Our devs have screwed up something. We'll be back soon.  "
  }
};
function renderPage(title, msg) {
  return  "<!DOCTYPE html>" + 
          "<html> <head> <title>" + title + " </title> </head> " +
          "<body> <h1> " + msg + " </h1> </body>" + 
          "</html>";
}

module.exports = {
  "domainName" : "http://127.0.0.1:8080/",
  "currentAPI" : "127.0.0.1:8080/v1/",
  "paths" : {
    "public" : __dirname + "/../public/",
    "data" : __dirname + "/../data/"
  }, 
  "errors" : {
    "write" : function(code, res) {
      if(Object.keys(errors).indexOf(code)) {
        res.writeHead(code, { "Content-Type" : "text/html" });
        res.end(renderPage(errors[code].title, errors[code].msg));
      } else {
        res.end(renderPage(errors[500].title, errors[500].msg));       
      }
    }
  }
};
