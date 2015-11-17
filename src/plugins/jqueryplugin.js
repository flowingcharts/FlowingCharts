/* jshint browserify: true */
'use strict';

var $ = require('jQuery');
var CartesianCanvas = require('../canvas/CartesianCanvas');

$.fn.flowingcharts = function (options) 
{	
	options.container = this[0];
	var chart = new CartesianCanvas(options);
	return this;
};