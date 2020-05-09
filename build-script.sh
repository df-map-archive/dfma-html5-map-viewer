rm -rf build || true
mkdir -p build/xdfmadev
mkdir -p build/xdfmadev/js
mkdir -p build/xdfmadev/js/licenses

git submodule init
git submodule update

cp external/DFMA-Viewer-HTML5/licenses/* build/xdfmadev/js/licenses

cp external/DFMA-Viewer-HTML5/public/*.js build/xdfmadev/js
cp external/DFMA-Viewer-HTML5/public/*.html build/xdfmadev/js
cp external/DFMA-Viewer-HTML5/public/*.css build/xdfmadev/js
cp external/DFMA-Viewer-HTML5/public/*.fdf-map build/xdfmadev/js
