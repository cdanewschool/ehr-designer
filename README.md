EHR Designer
------------

The EHR Designer is a drag and drop layout builder for prototyping interface layouts for Electronic Health Record systems.

The [Node](http://nodejs.org/) server uses a variety of technologies including [Express](http://expressjs.com/), [Mongoose](http://mongoosejs.com), [Passport](http://passportjs.org/) (for authentication), [PhantomJS](http://phantomjs.org/) (for project screenshotting) and [Mongo](http://www.mongodb.org/). [Mandrill](https://www.mandrill.com/) is also used for sending email over SMTP. The client is built using [Angular](https://angularjs.org/).

A demo of this application can be viewed at [http://ar210.piim.newschool.edu:3010](http://ar210.piim.newschool.edu:3010).

Installation
============
Install [PhantomJS](http://phantomjs.org/) (used by node-webshot for project snapshotting):
	
	brew install phantomjs
	
Install global node modules [`mongoose-fixture`](https://github.com/mgan59/mongoose-fixture) and [`webshot`](https://github.com/brenden/node-webshot):
	
	npm install -g mongoose-fixture
	npm install -g webshot

Clone the repository (if you haven't already) and move into it:

	git clone https://github.com/piim/ehr-designer.git && cd ehr-designer

Install dev dependencies:

	npm install && bower install --allow-root
	
Build (creates `www/index.html` from `dist/index.tpl.html` template):

	grunt
	
Import data:

	mongoose-fixture --fixture='all' --add
	
**NOTE:** if you have trouble installing or using `mongoose-fixture`, you can alternately import the data files in `lib/import/mongoimport` manually using [mongoimport](http://docs.mongodb.org/v2.2/reference/mongoimport/).

Running
=======

Start the server (on port 3000):

	cd [install directory]
	node server
	
Visit [`localhost:3100`](http://localhost:3000). To run on a different port, specify the desires port when starting the server, i.e. `PORT=8080 node server`.

Configuration
=============
###Email Confirmation###
To enable optional email confirmation, open `lib/config/config.js`, set `confirmAccounts=true` and enter a [Mandrill](https://www.mandrill.com/) API key.

Credits
=======
The EHR Designer was built by the [Parsons Institute for Information Mapping](http://piim.newschool.edu) and funded by the [Telemedicine and Advanced Technology Research Center (TATRC)](http://www.tatrc.org/).