
var file = require('file');
var manager = require('../manager');
var config = require('../config');

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
			movies.push({
	      		name: row['name'],
	      		url: row['url'],
	      		date: row['dateAdded'],
				img: config.imageBaseUrl + config.posterSize + row['img'],
				originalTitle: row['originalTitle']
	    	});
		}
	},
	function (err, count) {
		res.json(
    		movies
  		);
	});
		
};


exports.movie = function (req, res) {
  var name = req.params.name;
  //if (id >= 0 && id < data.posts.length) {
    res.json(
      data.posts[0]
    );
  /*} else {
    res.json(false);
  }*/
};

// POST

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