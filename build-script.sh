rm -rf build || true
rm -rf dist || true

mkdir -p build/xdfmadev
mkdir -p build/xdfmadev/parcel

git rev-parse HEAD > build/buildhash.txt
node scripts/setBuildInformation.js

npm run parcel -s

cp -r dist/* build/xdfmadev/parcel