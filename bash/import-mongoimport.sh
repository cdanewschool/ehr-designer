#!/bin/bash

# imports json dumps located at lib/import/mongoimport/ to their respective collections
# an alternative to fixture-based import via `bash/import-mongoose-fixture.sh`
# note that collections are emptied prior to import

mongo ehr-designer --eval "db.elements.drop()"
mongoimport --db ehr-designer --collection elements --file lib/import/mongoimport/elements.json

mongo ehr-designer --eval "db.components.drop()"
mongoimport --db ehr-designer --collection components --file lib/import/mongoimport/components.json

mongo ehr-designer --eval "db.templates.drop()"
mongoimport --db ehr-designer --collection templates --file lib/import/mongoimport/templates.json

mongo ehr-designer --eval "db.exporttypes.drop()"
mongoimport --db ehr-designer --collection exporttypes --file lib/import/mongoimport/exporttypes.json

mongo ehr-designer --eval "db.designrules.drop()"
mongoimport --db ehr-designer --collection designrules --file lib/import/mongoimport/designrules.json