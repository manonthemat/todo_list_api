// simple ToDo-API (GET, POST, PUT, DELETE) using node
var http = require('http');
var url = require('url');
var server = http.createServer();
var items = [];

server.on('request', function(req, resp) {
  // following: lot of code for refactoring practice
  switch (req.method) {
    case 'GET':
      var body = items.map(function(item, i) {
        return (i+1) + ' ' + item}).join('\n');
      resp.setHeader('Content-Length', Buffer.byteLength(body));
      resp.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      resp.end(body);
      break;
    case 'POST':
      var item = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        item += chunk;
      });
      req.on('end', function() {
        items.push(item);
        resp.end('OK\n');
      });
      break;
    case 'PUT':
      req.setEncoding('utf8');
      var i = parseInt(url.parse(req.url).pathname.slice(1));

      if (isNaN(i)) {
        resp.statusCode = 400;
        resp.end('Invalid item id');
      } else if (!items[i-1]) {
        resp.statusCode = 404; // or maybe create instead?
        resp.end('Item not found');
      } else {
        var item = '';
        req.on('data', function(chunk) {
          item += chunk;
        });
        req.on('end', function() {
          items[i-1] = item;
          resp.end('Item updated');
        });
      }
      break;
    case 'DELETE':
      var i = parseInt(url.parse(req.url).pathname.slice(1));

      if (isNaN(i)) {
        resp.statusCode = 400; // bad request
        resp.end('Invalid item id');
      } else if (!items[i-1]) {
        resp.statusCode = 404;
        resp.end('Item not found');
      } else {
        items.splice(i-1, 1);
        resp.end('OK\nItem deleted');
      }
      break;
  } // end switch/case-block
});

server.listen(3000);
