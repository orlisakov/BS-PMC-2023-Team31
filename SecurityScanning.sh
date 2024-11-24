#!/bin/bash

# Install retire
npm install retire

# Run retire and output to file, also print to console
./node_modules/.bin/retire --outputformat json | tee retireoutput

# Print the output file
cat retireoutput