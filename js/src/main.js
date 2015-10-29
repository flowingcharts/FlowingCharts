/* jshint browserify: true */
'use strict';

// Grab an existing namespace object, or create a blank object if it doesn't exist.
var flowingcharts = window.flowingcharts || {};

// Add the modules.
// Only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly.
flowingcharts.BoundingBox = require('./geom/BoundingBox.js');
flowingcharts.canvas = require('./canvas/util.js');
require('./plugins/jqueryplugin.js');

// Replace/Create the global namespace
window.flowingcharts = flowingcharts;

var bb = new flowingcharts.BoundingBox();
window.console.log(bb);
var bb2 = new flowingcharts.BoundingBox(34,567,867,2345);
window.console.log(bb2);