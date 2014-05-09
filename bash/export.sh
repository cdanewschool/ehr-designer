#!/bin/bash

mongoexport -d ehr-designer -c components -o lib/import/mongoimport/components.json
mongoexport -d ehr-designer -c templates -o lib/import/mongoimport/templates.json