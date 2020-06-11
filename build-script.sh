rm -rf build || true
rm -rf dist || true

mkdir -p build/xdfmadev
mkdir -p build/xdfmadev/parcel

npm run parcel -s

cp -r dist/* build/xdfmadev/parcel