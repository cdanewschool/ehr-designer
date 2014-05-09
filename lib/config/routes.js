'use strict';

var auth = require('../config/auth'),
	path = require('path');

module.exports = function(app)
{
	//	user
	var users = require('../controllers/users');
	app.post('/auth/users', users.create);
	app.get('/auth/users/verify/:token', users.verify);
	
	//	session
	var session = require('../controllers/session');
	app.post('/auth/session',session.login);
	app.get('/auth/session',auth.ensureAuthenticated,session.session);
	app.del('/auth/session',session.logout);
	
	//	project
	var projects = require('../controllers/projects');
	app.get('/api/projects',projects.all);
	app.post('/api/projects',auth.ensureAuthenticated,projects.create);
	app.get('/api/projects/:projectId',auth.project.hasAuthorization,projects.show);
	app.put('/api/projects/:projectId',auth.ensureAuthenticated,auth.project.hasAuthorization,projects.update);
	app.del('/api/projects/:projectId',auth.ensureAuthenticated,auth.project.hasAuthorization,projects.destroy);
	
	//	component
	var components = require('../controllers/components');
	app.get('/api/components',components.all);
	
	//	template
	var templates = require('../controllers/templates');
	app.get('/api/templates',templates.all);
	
	//	image
	var images = require('../controllers/images');
	app.get('/api/images',images.all);
	app.post('/api/images',auth.ensureAuthenticated,images.create);
	app.del('/api/images/:imageId',auth.ensureAuthenticated,auth.image.hasAuthorization,images.destroy);
	app.get('/image',images.show);
	
	app.param("projectId",projects.project);
	app.param("imageId",images.image);
	
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
