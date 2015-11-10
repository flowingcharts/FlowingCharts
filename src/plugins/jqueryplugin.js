/* jshint browserify: true */
'use strict';

var $ = require('jQuery');
var CartesianChart = require('../geom/CartesianChart');

$.fn.flowingcharts = function (options) 
{	
	options.container = this[0];
	var chart = new CartesianChart(options);
	return this;
};