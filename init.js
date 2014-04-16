
var fs = require("fs");
var mDB = require('moviedb')('88aeab692b4d1114d6fde07acca23741');
var manager = require("./manager");
var model = require("./model");
var config = require("./config");


var walk = function(dir, videoType, done) {
  var results = [];

  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;

      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, videoType, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
			var mv = new model.Movie();
			mv.name = dir.split('/');
			mv.name = mv.name[mv.name.length - 1];
			mv.dirPath = dir;
			mv.filePath = file;
			mv.type = videoType;
			mv.dateAdded = stat.ctime.getTime();
			//console.log(mv);
			//console.log('dir : ' + dir);
			//	console.log('file : ' + file);
		  if (mv.filePath.match(/[^.]((.*avi$)|(.*mp4$)|(.*mkv$)|(.*wmv$)|(.*rmvb$))/gi) != null) {
			console.log(mv.filePath + 'match !!');
			manager.selectMovie(mv.name, function (err, rows) {
				if (rows == null || rows.length == 0) {
					fetchFromMovieDB(mv, function (fullMovie) {
						results.push(fullMovie);
						manager.insertMovie(fullMovie);
					});
				}
				else {
					console.log("Movie " + mv.name + " already exist in DB");
				}
			});
		  }
          next();
        }
      });
    })();
  });
};

var fetchFromMovieDB = function (movie, callback) {
	mDB.searchMovie({query: movie.name }, function(err, res){
	  var mdbmv;
		if (err != null) console.log(err);
		if (res != null) {
			mdbmv = res['results']
			if (mdbmv != null && mdbmv.length > 0) {
				mdbmv = mdbmv[0];
				movie.img = mdbmv['poster_path'];
				movie.mdbId = mdbmv['id'];
				movie.dateRelease = mdbmv['release_date'];
				movie.originalTitle = mdbmv['original_title'];
				movie.voteAverage = mdbmv['vote_average'];
				movie.voteCount = mdbmv['vote_count'];
				console.log(movie);
				callback(movie);
				return ;
			}
		}
		console.log('fetchFromMovieDB for ' + movie.name + ' return nothing');
		
	});
}

var init = function() {
	manager.initDb();
	mDB.configuration(function (err, res) {
		config.imageBaseUrl = res['images']['base_url']; 
		config.posterSize = res['images']['poster_sizes'][0];
		
		console.log('The  MDB Config : image base url = ' + config.imageBaseUrl + ' - poster size = config.posterSize');
		
		walk(config.moviesPath, 'movie', function (err, res) {
			if (err) throw err;
		});
	});
};

exports.initAll = init;