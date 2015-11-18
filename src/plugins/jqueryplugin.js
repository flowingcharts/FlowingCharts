/* jshint browserify: true */
'use strict';

var $ = require('jQuery');
var Canvas = require('../canvas/SvgCanvas');

$.fn.flowingcharts = function (options) 
{	
	options.container = this[0];
	var chart = new Canvas(options);
	return this;
};