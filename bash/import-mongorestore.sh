#!/bin/bash

# imports json dumps located at lib/import/mongoimport/ to their respective collections
# an alternative to fixture-based import via `bash/import-mongoose-fixture.sh`
# note that collections are emptied prior to import

mongo ehr-designer --eval "db.elements.drop()"
mongorestore --db ehr-designer --collection elements lib/import/mongoimport/ehr-designer/elements.bson

mongo ehr-designer --eval "db.components.drop()"
mongorestore --db ehr-designer --collection components lib/import/mongoimport/ehr-designer/components.bson

mongo ehr-designer --eval "db.templates.drop()"
mongorestore --db ehr-designer --collection templates lib/import/mongoimport/ehr-designer/templates.bson

mongo ehr-designer --eval "db.exporttypes.drop()"
mongorestore --db ehr-designer --collection exporttypes lib/import/mongoimport/ehr-designer/exporttypes.bson

mongo ehr-designer --eval "db.designrules.drop()"
mongorestore --db ehr-designer --collection designrules lib/import/mongoimport/ehr-designer/designrules.bson