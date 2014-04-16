
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var config = require("./config");

var initDb = function () {
	var exists = fs.existsSync(config.dbName);
	exports.db = new sqlite3.Database(config.dbName);
	
	exports.db.serialize(function() {
	  	if(!exists) {
		    exports.db.run("CREATE TABLE Movies (name TEXT, dirPath TEXT, filePath TEXT, dateAdded TEXT, img TEXT, mdbId INTEGER, dateRelease TEXT, originalTitle TEXT, voteAverage REAL, voteCount INTEGER)");
		 }
	});
};

var selectAllMovies = function (eachrowcallback, completecallback) {
		exports.db.each("SELECT * FROM Movies", eachrowcallback, completecallback);
};


var selectMovie = function (name, callback) {
	exports.db.serialize(function() {
		exports.db.all("SELECT name FROM Movies WHERE name=?", name, callback);
	});
};

var insertMovie = function (movie) {
	
			var stmt = exports.db.prepare("INSERT INTO Movies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

			stmt.run(movie.name, movie.dirPath, movie.filePath, movie.dateAdded, movie.img, movie.mdbId, movie.dateRelease, movie.originalTitle, movie.voteAverage, movie.VoteCount);

			stmt.finalize();
};


exports.initDb = initDb;
exports.insertMovie = insertMovie;
exports.selectAllMovies = selectAllMovies;
exports.selectMovie = selectMovie;