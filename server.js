/**
 * NOTE: Node server architecture largely based on angular-passport project:
 * https://github.com/DaftMonk/angular-passport
 */
'use strict';

var config = require('./lib/config/config'),
	express = require('express'),
	fs = require('fs'),
	mongoStore = require('connect-mongo')(express),
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

//	app will default to development if NODE_ENV=undefined
app.configure
(
	"development",
	function()
	{
		app.use(express.static(path.join(__dirname, 'www')));
		app.use(express.errorHandler());
		app.use('/ehr-designer/www/js',express.static(path.join(__dirname, 'www/js')));
		app.use('/ehr-designer/www/css',express.static(path.join(__dirname, 'www/css')));
		app.use('/ehr-designer/www/bower_components',express.static(path.join(__dirname, 'www/bower_components')));
		
		app.use('/ehr-designer/www/app',express.static(path.join(__dirname, 'www/app')));
		app.set('views',__dirname + '/www');
	}
);

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use
(
	express.session
	(
		{
			secret: 'MEAN',
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
app.use(app.router);

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