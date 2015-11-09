/* jshint browserify: true */
'use strict';

// Grab an existing namespace object, or create a blank object if it doesn't exist.
// Add the modules.
// Only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly.
var flowingcharts = window.flowingcharts || 
{
    BoundingBox : require('./geom/BoundingBox'),
    CartesianChart : require('./geom/CartesianChart'),
    canvas : require('./canvas/util')
};

require('./plugins/jqueryplugin');

// Replace/Create the global namespace
window.flowingcharts = flowingcharts; 
var fc = flowingcharts;

var chart = new fc.CartesianChart();


var bb = new fc.BoundingBox();
window.console.log(bb);
var bb2 = new fc.BoundingBox("bah",567,867,2345);
window.console.log(bb2);
var t = bb.intersects("test");