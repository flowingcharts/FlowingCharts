/* jshint browserify: true */
'use strict';

// Grab an existing namespace object, or create a blank object if it doesn't exist.
// Add the modules.
// Only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly.
var flowingcharts = window.flowingcharts ||
{
    canvas : require('./canvas/Canvas')
};

require('./plugins/jqueryplugin');

// Replace/Create the global namespace
window.flowingcharts = flowingcharts;