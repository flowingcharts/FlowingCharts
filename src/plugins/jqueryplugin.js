/* jshint browserify: true */
'use strict';

var $     = require('jQuery');
var Chart = require('../charts/Chart');

$.fn.flowingcharts = function (options) 
{	
	options.container = this[0];
    var chart = new Chart(options);
	return this;
};