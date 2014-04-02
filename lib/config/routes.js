'use strict';

var auth = require('../config/auth');

module.exports = function(app)
{
	var users = require('../controllers/users');
	
	app.post('/auth/users', users.create);
	
	var session = require('../controllers/session');
	
	app.post('/auth/session',session.login);
	app.get('/auth/session',auth.ensureAuthenticated,session.session);
	app.delete('/auth/session',session.logout);
	
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