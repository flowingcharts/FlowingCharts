/* jshint browserify: true */
'use strict';

var $ = require('jQuery');
var HtmlCanvas = require('../canvas/HtmlCanvas');
var SvgCanvas = require('../canvas/SvgCanvas');

$.fn.flowingcharts = function (options) 
{	
	options.container = this[0];

    var chart = null; 
    if (options.renderer === 'svg')
        chart= new SvgCanvas(options);
    else                            
        chart= new HtmlCanvas(options);

	return this;
};