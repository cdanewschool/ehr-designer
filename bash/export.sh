#!/bin/bash

# writes json dumps of the elements, components and templates collections to lib/import/mongoimport/
# used by the `bash/import-mongoimport.sh` shell script

mongoexport -d ehr-designer -c elements -o lib/import/mongoimport/elements.json
mongoexport -d ehr-designer -c components -o lib/import/mongoimport/components.json
mongoexport -d ehr-designer -c templates -o lib/import/mongoimport/templates.json