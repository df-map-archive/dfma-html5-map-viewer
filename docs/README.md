# DFMA HTML5 Map Viewer Architecture

The following diagram describes the intended architecture of the viewer:

![Architecture Diagram - Parcelled JS running a renderer using P5, and a parser using Pako and Zlib](./diagrams/architecture.drawio.svg)

The viewer is designed to run on a local user device; using web standard software such as a Web Browser supporting HTML5 DOM, Canvas, and JavaScript.

Information about the map to view, and the binary map file, are stored on the DFMA website. The information about the map is encoded in a HTML document, on request, and sent to the user's browser. The binary .fdf-map file will be downloaded later. The map viewer itself is a packaged JS application put together using Parcel, P5 for pixel rendering to Canvas, and Pako for ZLIB decompression of the binary map file.

## Key Javascript Components

To help navigate the code base, look out for these files:
- Control Layer (map-viewer.js) - the control logic that holds information about the active map, active layer, view position, and loading state
- Map Parser (parser.js) - the logic of decoding a binary .fdf-map file into useful JS memory structures
- Map Renderer (renderer.js) - the P5 functions that render the pixels to screen
- User Inputs (user-inputs.js) - event handlers for key presses, button clicks, and mouse movements
- Read Map Info (read-map-info.js) - adapt HTML tags in the page to setup the initial map state
- Drag & Drop (drag-and-drop.js) - legacy support for dragging a local map into the viewer

## JavaScript Libraries

The project depends on these external libraries:
- **p5.js** - aka Processing (https://p5js.org/) a JavaScript library for creative coding, with a focus on making coding accessible and inclusive for artists, designers, educators, beginners, and anyone else
- **pako** (https://github.com/nodeca/pako) - a zlib port to javascript, very fast!

## Interface between HTML Document and Viewer

The viewer needs to be included into the HTML document, like so:
```html
<script src="./map-viewer.js"></script>
```

The pixels from the viewer need somewhere to live in the HTML page, at the moment that's here:
```html
<div id="p5-dfma-html5-map-viewer">
    <!-- P5.js Canvas goes here -->
</div>
```

To set the initial state of the viewer, the following tags should be present:
```html
<default-map>
    <map-link>/dfma/maps/2020-03/mounf-Bellsshower-A_library-251-110.fdf-map</map-link>
    <!-- map-link: String URL of the map file to load; subject to CORS -->
    <map-description>What's the story of this fortress?</map-description>
    <start-level>68</start-level>
    <!-- start-level: Integer; match the layer ID in the .fdf-map file -->
    <start-x>1824</start-x>
    <!-- start-x: Integer; pixel position offset from left of render area -->
    <start-y>976</start-y>
    <!-- start-y: Integer; pixel position offset from top of render area -->
    <start-zoom>1.00</start-zoom>
    <!-- start-zoom: Float; view scale: 2.00 is 2x zoomed in, 0.5 is 1/2x zoomed out > -->
    <start-orientation>top</start-orientation>
    <!-- start-orientation: String; top, side, or front  -->
    <poi-title>Temporary fort</poi-title>
    <!-- poi-title: String; title of the current point of interest  -->
    <poi-description>What happened here?</poi-description>
    <poi-author>DFMA User ID</poi-author>
</default-map>
```