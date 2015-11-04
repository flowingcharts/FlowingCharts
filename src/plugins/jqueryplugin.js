/* jshint browserify: true */
'use strict';

var $ = require('jQuery');

$.fn.flowingcharts = function (options) 
{
	var settings = $.extend(
	{
		color 			: "#556b2f",
		backgroundColor	: "brown"
	}, options );

	this.css(  
	{
		color 			: settings.color,
		backgroundColor	: settings.backgroundColor
	});

	return this;
};