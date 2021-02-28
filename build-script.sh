rm -rf build || true
rm -rf dist || true

if [[ -z "$RELEASE_VERSION" ]]; then
  destinationFolder="build/xdfmadev/parcel"
else
  destinationFolder="build/$RELEASE_VERSION"
fi

echo "Making $destinationFolder"

mkdir -p "$destinationFolder"

git rev-parse HEAD > build/buildhash.txt
node scripts/setBuildInformation.js

npm run parcel -s

cp -r dist/* $destinationFolder