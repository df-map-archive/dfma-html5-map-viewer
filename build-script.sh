#!/bin/bash

rm -rf build || true
rm -rf dist || true

if [[ -z "$GITHUB_REF" ]]; then
  destinationFolder="build/xdfmadev/parcel"
else
  RELEASE_VERSION=${GITHUB_REF#refs/*/}
  if [ "$RELEASE_VERSION" == "master" ]; then
    destinationFolder="build/viewer/js/latest/"
  else
    destinationFolder="build/viewer/js/$RELEASE_VERSION"
  fi 
fi

echo "Making $destinationFolder"

mkdir -p "$destinationFolder"

git rev-parse HEAD > build/buildhash.txt
node scripts/setBuildInformation.js

npm run parcel -s

cp -r dist/* $destinationFolder