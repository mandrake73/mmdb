
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  init = require('./init'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorHandler'),
  http = require('http'),
  engines = require('consolidate');;

var app = module.exports = express();

// Configuration
  app.set('views', __dirname + '/public');
  app.engine('html', engines.hogan);
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(express.static(__dirname + '/public'));


var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
else {
  app.use(errorHandler());	
}

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/movies', api.movies);

app.get('/api/movie/:name', api.movie);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

console.log('Start init db');
init.initAll();
console.log('End init db');
// Start server

var server = http.createServer(app).listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});
