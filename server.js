/**
 * NOTE: Node server architecture largely based on angular-passport project:
 * https://github.com/DaftMonk/angular-passport
 */
'use strict';

var config = require('./lib/config/config'),
	bodyParser = require('body-parser'),
	busboy = require('connect-busboy'),
	cookieParser = require('cookie-parser'),
	errorHandler = require('errorhandler'),
	express = require('express'),
	expressSession = require('express-session'),
	fs = require('fs'),
	mongoStore = require('connect-mongo')(expressSession),
	passport = require('passport'),
	path = require('path');

var app = express();
var db = require('./lib/db/mongo').db;

//	load mongoose model definitions	
var modelPath = path.join(__dirname,'lib/models');
fs.readdirSync(modelPath).forEach
(
	function(file)
	{
		require(modelPath+'/'+file);
	}
);

//	passport configuration
var pass = require('./lib/config/pass');

var env = process.env.NODE_ENV || 'development';

if ('development' == env) 
{
	app.use(express.static(path.join(__dirname, 'www')));
	app.use(errorHandler());
	
	app.use('/editor/js',express.static(path.join(__dirname, 'www/js')));
	app.use('/editor/css',express.static(path.join(__dirname, 'www/css')));
	app.use('/editor/bower_components',express.static(path.join(__dirname, 'www/bower_components')));
	app.use('/editor/app',express.static(path.join(__dirname, 'www/app')));
	app.use('/editor/data',express.static(path.join(__dirname, 'www/data')));
	app.set('views',__dirname + '/www');
}

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(cookieParser());
app.use(bodyParser.json({limit:'2mb'}));

app.use
(
	busboy
	(
		{
			limits: 
			{
				fileSize: 1024 * 1024 * 2
			}
		}
	)
);

app.use
(
	expressSession
	(
		{
			resave: true,
			saveUninitialized: true,
			secret: 'EHRDESIGNER',
			store: new mongoStore
			(
				{
					url: config.db,
					collection: 'sessions'
				}
			)
		}
	)
);

app.use(passport.initialize());
app.use(passport.session());

require('./lib/config/routes')(app);

var port = process.env.PORT || 3000;

var server = app.listen
(
	port,
	function()
	{
		console.log('listening on port ' + server.address().port );
	}
);