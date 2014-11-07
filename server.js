#!/bin/env node
/**
 * Module dependencies.
 */
var express = require('express'),
config = require('./config'),
basicAuth = require('basic-auth'),
  routes = require('./routes'),
  api = require('./routes/api'),
  init = require('./init'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
 // errorHandler = require('error-handler'),
  http = require('http'),
  engines = require('consolidate'),
  wait = require('wait.for');

var app = module.exports = express();

// Configuration
  app.set('views', __dirname + '/public');
  app.engine('html', engines.hogan);
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(express.static(__dirname + '/public'));


var env = process.env.NODE_ENV || 'development';
/*if ('development' == env) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
else {
  app.use(errorHandler());	
}*/

// Synchronous Function
var auth = function(username, password) {
  return function(req, res, next) {
    var user = basicAuth(req);

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
    }

    next();
  };
};

app.use('/', auth(config.user, config.passwd));

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/movies', api.movies);
app.get('/api/tvshows', api.tvshows);

app.get('/api/movies/:name', api.movie);
app.get('/api/tvshows/:name', api.tvshow);

app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

app.post('/api/uploaddb', api.uploaddb);

// redirect all others to the index (HTML5 history)
app.get('*', auth, routes.index);

var self = this;

self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// Start server
if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
};
		
var server = http.createServer(app).listen(self.port, self.ipaddress, function(){
	console.log('Start init db');
	wait.launchFiber(function () {
		init.initAll();
	});
	console.log('End init db');
  console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});
