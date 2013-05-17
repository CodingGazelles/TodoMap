
var utils = require('./../utils'),
	models = require('./../models');


/*
 * GET home page.
 */

exports.viewMapPage = function(req, res) {
	res.render('view-map', {
		title: 'ToDoMap'
	});
};

/*
 * GET navbar.
 */

exports.navbar = function(req, res) {
	res.render('partials/navbar');
};

/*
 * GET help.
 */

exports.help = function(req, res) {
	res.render('partials/help');
};


/*
 * GET todomap.
 */

exports.map = function(req, res) {
	res.render('views/map/index');
};