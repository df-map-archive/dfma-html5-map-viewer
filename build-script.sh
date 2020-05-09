rm -rf build || true
rm -rf dist || true

mkdir -p build/xdfmadev
mkdir -p build/xdfmadev/js
mkdir -p build/xdfmadev/js/licenses
mkdir -p build/xdfmadev/parcel

git submodule init
git submodule update

npm run parcel

cp external/DFMA-Viewer-HTML5/licenses/* build/xdfmadev/js/licenses
cp external/DFMA-Viewer-HTML5/public/*.js build/xdfmadev/js
cp external/DFMA-Viewer-HTML5/public/*.html build/xdfmadev/js
cp external/DFMA-Viewer-HTML5/public/*.css build/xdfmadev/js
cp external/DFMA-Viewer-HTML5/public/*.fdf-map build/xdfmadev/js

cp dist/* build/xdfmadev/parcel