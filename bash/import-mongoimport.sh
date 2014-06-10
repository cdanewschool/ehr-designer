#!/bin/bash

#import elements
mongo ehr-designer --eval "db.elements.drop()"
mongoimport --db ehr-designer --collection elements --file lib/import/mongoimport/elements.json

#import components
mongo ehr-designer --eval "db.components.drop()"
mongoimport --db ehr-designer --collection components --file lib/import/mongoimport/components.json

#import templates
mongo ehr-designer --eval "db.templates.drop()"
mongoimport --db ehr-designer --collection templates --file lib/import/mongoimport/templates.json