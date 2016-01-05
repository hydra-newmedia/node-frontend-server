var port = 3000;
var express = require('express');
var path = require('path');
var configMiddleware = require('./configMiddleware');

var app = express();
app.use('/configs/*', configMiddleware);
app.use(express.static('./public')); //use static files in ROOT/public folder

app.get('*', function (request, response) { // 'redirect' to index.html but with same url => single page application
    response.sendFile('public/index.html', {root: path.dirname(__dirname)});
});

app.listen(process.env.PORT || port, function () {
    console.log('Starting server on port ' + port + '.');
});
