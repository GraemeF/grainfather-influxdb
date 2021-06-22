#!/usr/bin/env bash

npm install
npm run-script test
npm run-script build

cp package.json build/
cp package-lock.json dist/

pushd build || exit
zip -vrX ../grainfather-influxdb.zip src package.json package-lock.json
popd || exit
