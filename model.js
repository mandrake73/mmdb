

function Movie () {
    this.id = '';
    this.name = '';
	this.dirPath = '';
	this.filePath = '';
	this.url = '';
	this.dateAdded = '';
	this.img = '';
	this.mdbId = '';
	this.dateRelease = '';
	this.originalTitle = '';
	this.voteAverage = '';
	this.voteCount = '';
	this.overview = '';
	this.imdbId = '';
	this.runtime = '';
}

function TVShow () {
    this.id = '';
    this.name = '';
	this.dirPath = '';
	this.filePath = '';
	this.url = '';
	this.dateAdded = '';
	this.img = '';
	this.mdbId = '';
	this.dateRelease = '';
	this.originalTitle = '';
	this.voteAverage = '';
	this.voteCount = '';
	this.overview = '';
	this.numberOfSeasons = '';
	this.numberOfEpisodes = '';
	this.status = '';
	
	this.imdbId = '';
	this.tvrageId = '';
	this.tvdbId = '';
	
	this.seasonNumber = '';
	this.episodeNumber = '';

	this.seasonId = '';
	
}

exports.Movie = Movie;
exports.TVShow = TVShow;