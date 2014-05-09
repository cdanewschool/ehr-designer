#!/bin/bash

mongoose-fixture --fixture='components' --remove
mongoose-fixture --fixture='components' --add

mongoose-fixture --fixture='templates' --remove
mongoose-fixture --fixture='templates' --add