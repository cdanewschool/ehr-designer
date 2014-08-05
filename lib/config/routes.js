'use strict';

var auth = require('../config/auth'),
	path = require('path');

/**
 * Establishes all URIs valid in the application context
 */
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
	app.get('/api/projects/:projectId/export/:exportType',auth.project.hasAuthorization,projects.exportProject);
	app.put('/api/projects/:projectId',auth.ensureAuthenticated,auth.project.hasAuthorization,projects.update);
	app.del('/api/projects/:projectId',auth.ensureAuthenticated,auth.project.hasAuthorization,projects.destroy);
	
	//	element
	var elements = require('../controllers/elements');
	app.get('/api/elements',elements.all);
	
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
	
	//	exportType
	var exportTypes = require('../controllers/export-types');
	app.get('/api/export-types',exportTypes.all);
	
	//	map these params to middleware that will process them
	//	(by populating the request with an object matching the specified id)
	app.param("projectId",projects.project);
	app.param("imageId",images.image);
	
	// angular templates
	app.get
	(
		'/partials/*', 
		function(req, res) 
		{
			var requestedView = path.join('./www/', req.url);
			res.render(requestedView);
	 	}
	);
	
	//	catch-all: any un-matched URI will serve index.html by default
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
