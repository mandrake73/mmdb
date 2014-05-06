
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var config = require("./config");

var initDb = function () {
	var exists = fs.existsSync(config.dbName);
	exports.db = new sqlite3.Database(config.dbName);
	
	exports.db.serialize(function() {
	  	if(!exists) {
		    exports.db.run("CREATE TABLE Movies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, dirPath TEXT, filePath TEXT, dateAdded TEXT, img TEXT, mdbId INTEGER, dateRelease TEXT, originalTitle TEXT, voteAverage REAL, voteCount INTEGER, overview TEXT, runtime INTEGER, imdbId TEXT)");
			exports.db.run("CREATE TABLE TVShows (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, dirPath TEXT, dateAdded TEXT, img TEXT, mdbId INTEGER, dateRelease TEXT, originalTitle TEXT, voteAverage REAL, voteCount INTEGER, overview TEXT, imdbId TEXT, tvrageId TEXT, tvdbId TEXT, numberOfSeasons INTEGER, numberOfEpisodes INTEGER, status TEXT)");
			exports.db.run("CREATE TABLE TVShowSeasons (id INTEGER PRIMARY KEY AUTOINCREMENT, tvshowId INTEGER, seasonNumber INTEGER, numberOfEpisodes INTEGER, overview TEXT, dateRelease TEXT, img TEXT, mdbId INTEGER, imdbId TEXT, tvrageId TEXT, tvdbId TEXT)");
			exports.db.run("CREATE TABLE TVShowEpisodes (id INTEGER PRIMARY KEY AUTOINCREMENT, tvshowId INTEGER, seasonId INTEGER, episodeNumber INTEGER, filePath TEXT, subtitlePath TEXT, name TEXT, overview TEXT, dateRelease TEXT, img TEXT, mdbId INTEGER, imdbId TEXT, tvrageId TEXT, tvdbId TEXT)");
		 }
	});
};

var selectAllMovies = function (eachrowcallback, completecallback) {
		exports.db.each("SELECT * FROM Movies", eachrowcallback, completecallback);
};

var selectAllTVShows = function (eachrowcallback, completecallback) {
		exports.db.each("SELECT * FROM TVShows", eachrowcallback, completecallback);
};

var selectMovie = function (name, callback) {
	exports.db.serialize(function() {
		exports.db.all("SELECT * FROM Movies WHERE name=?", name, callback);
	});
};

var insertMovie = function (movie, callback) {
	
			var stmt = exports.db.prepare("INSERT INTO Movies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

			stmt.run(null, movie.name, movie.dirPath, movie.filePath, movie.dateAdded, movie.img, movie.mdbId, movie.dateRelease, movie.originalTitle, movie.voteAverage, movie.VoteCount, movie.overview, movie.runtime, movie.imdbId, callback);

			stmt.finalize();
};

var selectTVShow = function (name, callback) {
	exports.db.serialize(function() {
		exports.db.all("SELECT show.id, show.name, show.dirPath, show.dateAdded, show.img, show.mdbId, show.dateRelease, show.overview, show.imdbId, e.filePath, e.subtitlePath, e.episodeNumber, se.seasonNumber FROM TVShows show LEFT JOIN TVShowEpisodes e ON show.id = e.tvshowId LEFT JOIN TVShowSeasons se ON show.id = se.tvshowId AND e.seasonId = se.id WHERE show.name=?", name, callback);
	});
};

var selectTVShowSeason = function (id, seasonNumber, callback) {
	exports.db.serialize(function() {
		exports.db.all("SELECT * FROM TVShowSeasons WHERE tvshowId=? AND seasonNumber=?", id, seasonNumber, callback);
	});
};

var selectTVShowEpisode = function (id, seasonId, episodeNumber, callback) {
	exports.db.serialize(function() {
		exports.db.all("SELECT * FROM TVShowEpisodes WHERE tvshowId=? AND seasonId=? AND episodeNumber=?", id, seasonId, episodeNumber, callback);
	});
};

var insertTVShow = function (tvshow, callback) {
			var stmt = exports.db.prepare("INSERT INTO TVShows VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

			stmt.run(null, tvshow.name, tvshow.dirPath, tvshow.dateAdded, tvshow.img, tvshow.mdbId, tvshow.dateRelease, tvshow.originalTitle, tvshow.voteAverage, tvshow.VoteCount, tvshow.overview, tvshow.imdbId, tvshow.tvrageId, tvshow.tvdbId, tvshow.numberOfSeasons, tvshow.numberOfEpisodes, tvshow.status, callback);

			stmt.finalize();
};

var insertTVShowSeason = function (tvshow, callback) {
			var stmt = exports.db.prepare("INSERT INTO TVShowSeasons VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

			stmt.run(null, tvshow.id, tvshow.seasonNumber, null, null, null, null, null, null, null, null, callback);

			stmt.finalize();
};

var insertTVShowEpisode = function (tvshow, callback) {
			var stmt = exports.db.prepare("INSERT INTO TVShowEpisodes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

			stmt.run(null, tvshow.id, tvshow.seasonId, tvshow.episodeNumber, tvshow.filePath, tvshow.subtitlePath, null, null, null, null, null, null, null, null, callback);

			stmt.finalize();
};


exports.initDb = initDb;
exports.insertMovie = insertMovie;
exports.selectAllMovies = selectAllMovies;
exports.selectMovie = selectMovie;
exports.selectAllTVShows = selectAllTVShows;
exports.selectTVShow = selectTVShow;
exports.insertTVShow = insertTVShow;
exports.selectTVShowSeason = selectTVShowSeason;
exports.insertTVShowSeason = insertTVShowSeason;
exports.selectTVShowEpisode = selectTVShowEpisode;
exports.insertTVShowEpisode = insertTVShowEpisode;

