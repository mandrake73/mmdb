
var fs = require("fs");
var async = require("async");
var mDB = require('moviedb')('88aeab692b4d1114d6fde07acca23741');
var manager = require("./manager");
var model = require("./model");
var config = require("./config");


var walk = function(root, dir, videoType, done) {
  var results = [];

  	if (root.charAt(root.length - 1) != '/')
	{
		root = root + '/'
	}

  fs.readdir(dir, function(err, list) {
    if (err) return done(err, null);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;

      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(root, file, videoType, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
			//console.log(mv);
			console.log('dir : ' + dir);
			console.log('file : ' + file);
		  if (file.match(/(.*avi$)|(.*mp4$)|(.*mkv$)|(.*wmv$)|(.*rmvb$)/gi) != null && file.indexOf("/.") == -1) {
			results.push({rootPath: root, dirPath: dir, filePath: file, statInfo: stat});
			//eachcallback(root, dir, file, videoType, stat);
		  }
		  else {
			//console.log(file + ' don\'t match!!' + "\n");
		  }
          next();
        }
      });
    })();
  });
};

var eachMovieCallBack = function (data, callback) {
	console.log("dir: " + data.dirPath + " - file: " + data.filePath);
	var mv = new model.Movie();
	mv.name = data.dirPath.replace(data.rootPath, '');
	mv.name = mv.name.split('/');

	if (mv.name.length > 1) {
		mv.name = mv.name[1];
	}
	else {
		mv.name = mv.name[0];
	}
	
	mv.dirPath = data.dirPath;
	mv.filePath = data.filePath;
	mv.type = 'movie';
	mv.dateAdded = data.statInfo.ctime.getTime();
	console.log(mv.filePath + ' match !!');
	manager.selectMovie(mv.name, function (err, rows) {
		if (rows == null || rows.length == 0) {
			fetchFromMovieDB(mv, function (fullMovie) {
				//results.push(fullMovie);
				manager.insertMovie(fullMovie, function (err) {
					if (err) {
						throw err;
					}
					else {
						callback();
					}
				});
				
			});
			console.log("\n");
		}
		else {
			console.log("Movie " + mv.name + " already exist in DB" + "\n");
			callback();
		}
	});
}

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
				var bk = res;
				mDB.movieInfo({id: movie.mdbId}, function (err, res) {
					
					movie.overview = res['overview'];
					movie.imdbId = res['imdb_id'];
					movie.runtime = res['runtime'];
					
					console.log(movie);
					console.log("\n");
					
					callback(movie);	
				})
				return ;
			}
		}
		console.log('fetchFromMovieDB for ' + movie.name + ' return nothing');
		
	});
}

var fetchFromTVDB = function (tvshow, callback) {
	console.log("search");
	//console.log(tvshow);
	mDB.searchTv({query: tvshow.name }, function(err, res){
	  var mdbmv;
		//console.log("search 1");
		//if (err != null) console.log(err);
		if (res != null) {
			//console.log("search 2");
			//console.log(res);
			mdbmv = res['results']
			if (mdbmv != null && mdbmv.length > 0) {
				//console.log("search 3");
				mdbmv = mdbmv[0];
				tvshow.img = mdbmv['poster_path'];
				tvshow.mdbId = mdbmv['id'];
				tvshow.dateRelease = mdbmv['first_air_date'];
				tvshow.voteAverage = mdbmv['vote_average'];
				tvshow.voteCount = mdbmv['vote_count'];
					//console.log("info");
				mDB.tvInfo({id: tvshow.mdbId}, function (err, res) {
					tvshow.originalTitle = mdbmv['original_name'];
					tvshow.overview = res['overview'];
					tvshow.numberOfSeasons = res['number_of_seasons'];
					tvshow.numberOfEpisodes = res['number_of_episodes'];
					tvshow.status = res['status'];
					//console.log("extId");
					mDB.tvExternalIds({id: tvshow.mdbId}, function (err, res) {
						tvshow.imdbId = res['imdb_id'];
						tvshow.tvdbId = res['tvdb_id'];
						tvshow.tvrageId = res['tvrage_id'];
						
						//console.log(tvshow);
						//console.log("\n");
						//console.log("\n");
						//console.log("exit");
						callback(tvshow);
					});
				});
			}
			else {
				console.log('fetchFromMovieDB for ' + tvshow.name + ' return nothing');
				callback(null);
			}
		} else {
			console.log('fetchFromMovieDB for ' + tvshow.name + ' return nothing');
			callback(null);
		}
		
	});
}

var eachTVShowCallBack = function (data, callback) {
	/*
	{ dirPath: '/tmp/Videos/Series/How I Met Your Mother/Saison 1',
	      filePath: '/tmp/Videos/Series/How I Met Your Mother/Saison 1/himym.s01e01.avi',
	      statInfo: [Object] }
	*/
	//console.log(data);
	console.log("dir: " + data.dirPath + " - file: " + data.filePath + " - root:" + data.rootPath);
	var mv = new model.TVShow();
	mv.name = data.dirPath.replace(data.rootPath, '');
		//console.log("1: " + mv.name);
	mv.name = mv.name.split('/');
		//console.log("2: " + mv.name);
	
	if (mv.name.length > 1) {
		mv.name = mv.name[1];
	}
	else {
		mv.name = mv.name[0];
	}
		//console.log("3: " + mv.name);
	mv.dirPath = data.dirPath;
	mv.filePath = data.filePath;
	//mv.type = videoType;
	mv.dateAdded = data.statInfo.ctime.getTime();
		//console.log(mv.filePath + ' match !!');
	
	/*fetchFromTVDB(mv, function (fullTVShow) {
		
	console.log("\n");	
	});*/
	var fullShow;
	var selectedRow;
	async.series([
		//Checking if Show already exist and insert into DB
		function (callback) {
			console.log("checking show");
			manager.selectTVShow(mv.name, function (err, rows) {
				if (err) {
					throw err;
				}
				if (rows == null || rows.length == 0) {
					fetchFromTVDB(mv, function (filledShow) {
						if (filledShow == null) {
							throw new Error('Show ' + mv.name + " don't exist in TVDB");
						}
						fullShow = filledShow;
						manager.insertTVShow(filledShow, function (err) {
							if (err) {
								throw err;
							}
							else {
								console.log(mv.name + " inserted into DB\n");
								manager.selectTVShow(mv.name, function (err, rows) {
									console.log(rows);
									if (err) {
										throw err;
									}
									if (rows == null || rows.length == 0) {
										throw new Error('Show ' + mv.name + " don't exist in DB just after insertion" + "\n");
									}
									else {
										selectedRow = rows[0];
										callback();
									}
								});
							}
						});
					});
				}
				else {
					console.log('Show ' + mv.name + " already exist in DB" + "\n");
					manager.selectTVShow(mv.name, function (err, rows) {
						if (err) {
							throw err;
						}
						if (rows == null || rows.length == 0) {
							throw new Error('Show ' + mv.name + " don't exist in DB just after insertion" + "\n");
						}
						else {
							selectedRow = rows[0];
							callback();
						}
					});
				}
			});
		},
		function (callback) {
			console.log("checking season");
			var seasonInfo = extractSeasonEpisodeFromTitle(mv.filePath);
			if (seasonInfo != null)
			{
				
			}
			callback();
		},
		function (callback) {
			console.log("checking episode");
			callback();
		}
	],
	function (err, res) {
		if (err) {
			throw err;
		}
		else {
			callback();
		}
	});
	
var extractSeasonEpisodeFromTitle = function (title) {
	var res = title.match(/[s|S]?(\d{1,2})[e|E|x|X](\d{1,2})/);
	
	if (res != null && res.length >= 3)
	{
		return {season: res[1], episode: res[2]};
	}
	else
	{
		console.log("Can not extract season and episode number from " + title)
		return null;
	}

}
/*	manager.selectTVShow(mv.name, function (err, rows) {
		if (rows == null || rows.length == 0) {
			fetchFromTVDB(mv, function (fullMovie) {
				manager.insertTVShow(fullMovie, function (err) {
						console.log(mv.name + " inserted into DB\n");
				});
					
			});
			
		}
		else {
			console.log("TVShow " + mv.name + " already exist in DB" + "\n");
		}
	});*/
}



var init = function() {
	manager.initDb();
	mDB.configuration(function (err, res) {
		config.imageBaseUrl = res['images']['base_url']; 
		config.posterSize = res['images']['poster_sizes'][0];
		
		console.log('The  MDB Config : image base url = ' + config.imageBaseUrl + ' - poster size = config.posterSize');
		
		//Scan MOVIES
		async.series([
			function (callback) {	
				//Scan TVSHOWS		
				walk(config.moviesPath, config.moviesPath, 'movie', callback);
			},
		],
		function (err, res) {
			if (err) {
				throw err;
			}
			else {
				console.log("Movie Walk over\n");
				//console.log(res[0]);
				async.eachSeries(res[0], function (item, callback) {
					eachMovieCallBack(item, callback);
				},
				function (err) {
					// if any of the file processing produced an error, err would equal that error
					if( err ) {
						// One of the iterations produced an error.
						// All processing will now stop.
						console.log('A file failed to process');
					} else {
						console.log('All files have been processed successfully');
					}
				});
			}
		});
		
		//Scan TVSHOWS	
		async.series([
			function (callback) {		
				walk(config.seriesPath, config.seriesPath, 'tvshow', callback);
			},
		],
		function (err, res) {
			if (err) {
				throw err;
			}
			else {
				console.log("Serie Walk over\n");
				//console.log(res[0]);
				async.eachSeries(res[0], function (item, callback) {
					eachTVShowCallBack(item, callback);
				},
				function (err) {
					// if any of the file processing produced an error, err would equal that error
					if( err ) {
						// One of the iterations produced an error.
						// All processing will now stop.
						console.log('A file failed to process');
					} else {
						console.log('All files have been processed successfully');
					}
				});
			}
		});
	});
};

exports.initAll = init;