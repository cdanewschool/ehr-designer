EHR Designer Export (AngularJS)
-------------------------------

The files in this directory represent application scaffolding for a project exported from the EHR Designer on <%= model.date %>.

Installation
============
The following steps use the homebrew package manager for Mac. If you are on a PC, replace the `brew` command with the equivalent for your package manager.

Install [npm](https://www.npmjs.org/) if you do not already have it installed:
	
	brew install npm
	
Install the [`bower`](http://bower.io/) and [`grunt`](http://gruntjs.com/) node modules globally:
	
	npm install -g bower
	npm install -g grunt-cli

Unzip and move into the exported project directory (if you haven't done so already):

	cd [download location/export-<%= model.id %>-angular]

Install dependencies:
	
	npm install

That's it!

Testing
=======
To view the application, move the directory into your `localhost` site folder and pull it up in a browser by visiting `http://localhost/export-<%= model.id %>-angular]-angular/www`.