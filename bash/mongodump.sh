#!/bin/bash

# writes json dumps of the elements, components and templates collections to lib/import/mongoimport/
# used by the `bash/import-mongoimport.sh` shell script

mongodump -d ehr-designer -c elements -o lib/import/mongoimport/
mongodump -d ehr-designer -c components -o lib/import/mongoimport/
mongodump -d ehr-designer -c templates -o lib/import/mongoimport/
mongodump -d ehr-designer -c exporttypes -o lib/import/mongoimport/
mongodump -d ehr-designer -c designrules -o lib/import/mongoimport/