#!/usr/bin/env node
/**
 * Module dependencies.
 */


var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 8040);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}
var server = require('http').createServer(app);
var wsserver = require('./lib/wsserver');
wsserver.wsStart(server);

server.listen(app.get('port'),function() {
  console.log('Server listening on port ' + app.get('port'));
});

app.get('/', routes.index);

//server.listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});



