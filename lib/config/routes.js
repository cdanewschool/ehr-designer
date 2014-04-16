'use strict';

var auth = require('../config/auth'),
	path = require('path');

module.exports = function(app)
{
	//	user
	var users = require('../controllers/users');
	app.post('/auth/users', users.create);
	
	//	session
	var session = require('../controllers/session');
	app.post('/auth/session',session.login);
	app.get('/auth/session',auth.ensureAuthenticated,session.session);
	app.delete('/auth/session',session.logout);
	
	//	project
	var projects = require('../controllers/projects');
	app.get('/api/projects',projects.all);
	app.post('/api/projects',auth.ensureAuthenticated,projects.create);
	app.get('/api/projects/:projectId',projects.show);
	app.put('/api/projects/:projectId',auth.ensureAuthenticated,auth.project.hasAuthorization,projects.update);
	
	app.param("projectId",projects.project);
	
	// angular Routes
	app.get
	(
		'/partials/*', 
		function(req, res) 
		{
			var requestedView = path.join('./www/', req.url);
			res.render(requestedView);
	 	}
	);
	
	app.get
	(
		'/popups/*', 
		function(req, res) 
		{
			var requestedView = path.join('./www/', req.url);
			res.render(requestedView);
	 	}
	);

	app.get
	(
		'/*', 
		function(req, res) 
		{
			if(req.user) 
			{
				res.cookie('user', JSON.stringify(req.user.info));
			}

			res.render('index.html');
		}
	);
};