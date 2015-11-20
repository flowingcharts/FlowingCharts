/* jshint browserify: true */
'use strict';

var $               = require('jQuery');
var HtmlCanvas      = require('../canvas/HtmlCanvas');
var SvgCanvas       = require('../canvas/SvgCanvas');
var CartesianSpace  = require('../geom/CartesianSpace');

$.fn.flowingcharts = function (options) 
{	
	options.container = this[0];

    var chart = null; 
    if (options.renderer === 'svg')
        chart= new SvgCanvas(options, new CartesianSpace());
    else                            
        chart= new HtmlCanvas(options, new CartesianSpace());

	return this;
};