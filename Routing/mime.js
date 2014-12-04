var mime = {
  css : 'text/css',
  js : 'text/js',
  html : 'text/html',
  plain : 'text/plain'
}
exports.getContentType = function (type) {
  return (typeof mime[type] !== 'undefined') ? mime[type] : mime.plain;
} 
