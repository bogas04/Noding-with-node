var http = require('http');
var file = require('fs');
var domain = {
  value : '127.0.0.1:1234/',
  assets : {
    css : {
      style : 'http://127.0.0.1:1234/assets/css/style.css'
    },
    js : {
      website : 'http://127.0.0.1:1234/assets/js/website.js'
    }
  }
};
var views = {
  template : {
    error : function(title, body) {
      return '<html>' + 
        '<head>' +
           '<link href="'+ domain.assets.css.style +'" rel="stylesheet">' +
           '<title>' + title + '</title>' + 
         '</head>' + 
         '<body>' +
           '<h1> Oops! We encountered an error! </h1>' +
       	   '<hr>' +
  	   '<ul>' +
	     '<li> <a href="/"> Home </a> </li>' +   
	     '<li> <a href="/about"> About </a> </li>' +
	     '<li> <a href="/contact"> Contact Us </a> </li>' +
	   '</ul>' + 
            body + 
         '</body>' +
	 '<script src="' + domain.assets.js.website + '"></script>' +
      '</html>'; 
    },
    content : function(title, body) {
      return '<htm>' +
        '<head>' +
	  '<link href="'+ domain.assets.css.style +'" rel="stylesheet">' +
          '<title>' + title + '</title>' + 
         '</head>' + 
         '<body>' +
           '<h1> Welcome to Routing Example</h1>' +
       	   '<hr>' +
 	   '<ul>' +
  	     '<li> <a href="/"> Home </a> </li>' +   
  	     '<li> <a href="/about"> About </a> </li>' +
  	     '<li> <a href="/contact"> Contact Us </a> </li>' +
  	   '</ul>' +  
	   body + 
         '</body>' +
	 '<script src="' + domain.assets.js.website + '"></script>' +
      '</html>'; 
    }
  },
  home : null,
  about : null,
  contact : null,
  error : { _404 : null }
};
views.home = views.template.content('Home', 'This is home page' +
  '<p> We use : ' +
  '<ol>' +
    '<li> Routing using a switch </li>' +
    '<li> fs module to access assets (style.css and website.js) </li>' +
  '</ol>'
);
views.about = views.template.content('About', 'This is about page');
views.contact = views.template.content('Contact Us', 'nodejs@divjot.com');
views.error._404 = views.template.error('Page not found' , ' Error code : 404 ');
http.createServer(function(req, res) {
  switch(req.url) {
    case '/' : case '/home' :  
      res.writeHead(200, {
        'Content-Type' : 'text/html'
      });  
      res.end(views.home);
    break;
    case '/about' :
      res.writeHead(200, {
        'Content-Type' : 'text/html'
      }); 
      res.end(views.about);
    break;
    case '/contact' :
     res.writeHead(200, {
       'Content-Type' : 'text/html'
     });
     res.end(views.contact);
    break;
    default :
      file.readFile(__dirname + req.url, 'utf8', function(err, data) {
        if(err) {
    	  console.log(err);
 	  res.writeHead(404, {
   	    'Content-Type' : 'text/html'
  	  });
 	  res.end(views.error._404);
        } else {
  	  res.writeHead(200, {
	    'Content-Type' : 'text/plain'
  	  });
  	  res.end(data);
  	}
      });
  }
  console.log('Request made to ' + __dirname + req.url);
}).listen(1234, '127.0.0.1');
console.log('Server is on');
