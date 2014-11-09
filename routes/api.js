
var file = require('file');
var manager = require('../manager');
var config = require('../config');
var tools = require('../tools');
var init = require('../init');
var path = require('path');
var formidable = require('formidable');
var fs = require("fs");
 
/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"
var data = {
  "posts": [
    {
	"originalName": "nameee",
      "title": "Lorem ipsum",
      "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
		"originalName": "naaaame",
      "title": "Sed egestas",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    }
  ]
};

// GET

exports.movies = function (req, res) {
  var movies = [];
  
	manager.selectAllMovies(function (err, row) {
		if (row != null) {

			var tsNow = Date.now();
			console.log(row);
			movies.push({
	      		name: row['name'],
	      		url: row['url'],
	      		date: row['dateAdded'],
				img: (row['img'] != null ? config.imageBaseUrl + config.posterSize + row['img'] : './img/no-poster-' + config.posterSize + '.png'),
				originalTitle: row['originalTitle'],
				isNew: isNew(row['dateAdded'], tsNow, 24*60*60)
	    	});
		}
	},
	function (err, count) {
		res.json(
    		movies
  		);
	});
		
};

function isNew(date1, date2, delay) {

	if (((date2/1000 - date1/1000)) <= delay)
		return true;

	return false;
}

exports.movie = function (req, res) {
  	var name = req.params.name;
	manager.selectMovie(name, function (err, row) {
		var movie = {
			name: row[0]['name'],
			dateAdded: row[0]['dateAdded'],
			img: (row[0]['img'] != null ? config.imageBaseUrl + config.mediumPosterSize + row[0]['img'] : './img/no-poster-' + config.mediumPosterSize + '.png'),
			dateRelease: new Date(row[0]['dateRelease']).getFullYear(),
			originalTitle: row[0]['originalTitle'],
			voteAverage: row[0]['voteAverage'],
			overview: row[0]['overview'],
			runtime: Math.floor(row[0]['runtime'] / 60) + 'h' + tools.zeroPadNumber(Math.floor(row[0]['runtime'] % 60), 2),
			mdbUrl: config.mdbBaseUrl + row[0]['mdbId'],
			imdbUrl: config.imdbBaseUrl + row[0]['imdbId'],
			downloadUrl: config.urlMoviesFileStore + row[0]['filePath']
		};
		
		res.json(
	      movie
	    );
	});
};

exports.tvshows = function (req, res) {
  var movies = [];
  
	manager.selectAllTVShows(function (err, row) {
		if (row != null) {

			var tsNow = Date.now();

			movies.push({
	      		name: row['name'],
	      		url: row['url'],
	      		date: row['dateAdded'],
				img: config.imageBaseUrl + config.posterSize + row['img'],
				isNew: isNew(row['dateAdded'], tsNow, 24*60*60)
	    	});
		}
	},
	function (err, count) {
		res.json(
    		movies
  		);
	});
		
};

exports.tvshow = function (req, res) {
  	var name = req.params.name;
	manager.selectTVShow(name, function (err, row) {
		var show = {
			name: row[0]['name'],
			dateAdded: row[0]['dateAdded'],
			img: config.imageBaseUrl + config.mediumPosterSize + row[0]['img'],
			dateRelease: new Date(row[0]['dateRelease']).getFullYear(),
			originalTitle: row[0]['originalTitle'],
			voteAverage: row[0]['voteAverage'],
			overview: row[0]['overview'],
			runtime: Math.floor(row[0]['runtime'] / 60) + 'h' + tools.zeroPadNumber(Math.floor(row[0]['runtime'] % 60), 2),
			mdbUrl: config.mdbBaseUrl + row[0]['mdbId'],
			imdbUrl: config.imdbBaseUrl + row[0]['imdbId'],
			downloadUrl: {}
		};
		
		for(var i = 0; i < row.length; i++)
		{
			if (row[i]['filePath'] != null)
			{
				var season = "s" + row[i]['seasonNumber'].toString();
				var infos = { url:config.urlTvShowFileStore + row[i]['filePath'],
										season: row[i]['seasonNumber'],
										episode: row[i]['episodeNumber'], 
										subtitle: row[i]['subtitlePath'].replace(config.seriesPath, './Series')};

				if (show.downloadUrl[season] == null) {
					show.downloadUrl[season] = new Array();
				}

				show.downloadUrl[season].push(infos);
			}
		}

		res.json(
	      show
	    );
	});
};


// POST


exports.uploaddb = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		 if (err) 
		 {
           res.status(500);
           res.json({'success': false});
		   return ;
		 }
		 else if (fields.key != config.apiKey)
		 {
			console.log(fields.key + ' is not a valid API key');
			res.status(500);
			res.json({'success': false});
			return ;
		 }
		 else if (fields.type != 'movie' && fields.type != 'tvshow')
		 {
		 	console.log(fields.type + ' is not a valid type');
			res.status(500);
			res.json({'success': false});
			return ;	
		 }
        
		var queueSerieToAdd = new Array();
		var queueMovieToAdd = new Array();

		var i =0;
		 fs.readFileSync(files.file.path).toString().split('\n').forEach(function (line) { 
		 	if (line.match(/(.*avi$)|(.*mp4$)|(.*mkv$)|(.*wmv$)|(.*rmvb$)|(.*srt$)/gi) == null)
    		{
    			return ;
    		}
		 	
		 	var parts = line.split('|&|');
		 	var date = new Date(parts[0]);
		 	var size = parts[1];
		 	var filePath = parts[2];
    		var dirPath = path.dirname(filePath);
    		
    		console.log(date);
    		console.log(filePath);
    		console.log(dirPath);
    		console.log(fields.type);


    		if (fields.type == 'movie')
    		{
    			var item = {dirPath: dirPath, filePath: filePath, date: date, counter: i++};
    			if (size > 100000)
    			{
    				console.log('queuing movie ' + i);
					queueMovieToAdd.push(item);
					init.processImportQueue(queueMovieToAdd, 'movie');
    			}
    			else
    			{
    				console.log('Size too small (' + size + '): Not queuing movie ' + filePath)
    			}
    		}
    		else if (fields.type == 'tvshow')
    		{
    			var item = {dirPath: dirPath, filePath: filePath, date: date, counter: i++};
    			if (line.match(/(.*avi$)|(.*mp4$)|(.*mkv$)|(.*wmv$)|(.*rmvb$)/gi) == null || size > 10000)
    			{
    				console.log('queuing tvshow ' + i);
					queueSerieToAdd.push(item);
					init.processImportQueue(queueSerieToAdd, 'tvshow');
				}
				else
    			{
    				console.log('Size too small (' + size + '): Not queuing tvshow ' + filePath)
    			}
    		}
    		
    		return;
		});
		 res.status(200);
			res.json({'success': true});
    });
};

exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};