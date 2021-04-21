#!/bin/bash
rm -R coverage/
node node_modules/nyc/bin/nyc.js --reporter=lcov --reporter=text-lcov npm test