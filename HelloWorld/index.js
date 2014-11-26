var http = require('http');
http.createServer(function(request, response) {
  console.log('Request is made');
  response.writeHead(200, { 
    'Content-Type' : 'text/plain'
  });
  response.end('Hello World!\n');
}).listen(1234, '127.0.0.1');
console.log('Server is on');

