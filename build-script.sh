#!/bin/bash

rm -rf build || true
rm -rf dist || true

if [[ -z "$GITHUB_REF" ]]; then
  destinationFolder="build/xdfmadev/parcel"
else
  RELEASE_VERSION=${GITHUB_REF#refs/*/}
  destinationFolder="build/viewer/js/$RELEASE_VERSION"
fi

echo "Making $destinationFolder"

mkdir -p "$destinationFolder"

git rev-parse HEAD > build/buildhash.txt
node scripts/setBuildInformation.js

npm run parcel -s

cp -r dist/* $destinationFolder