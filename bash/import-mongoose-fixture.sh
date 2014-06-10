#!/bin/bash

mongoose-fixture --fixture='elements' --remove
mongoose-fixture --fixture='elements' --add

mongoose-fixture --fixture='components' --remove
mongoose-fixture --fixture='components' --add

mongoose-fixture --fixture='templates' --remove
mongoose-fixture --fixture='templates' --add