/* jshint browserify: true */
/* globals DEBUG */
'use strict';

var $     = require('jQuery');
var Chart = require('../charts/Chart');

if ($ !== undefined)
{
    $.fn.flowingcharts = function (options) 
    {   
        options.chart.container = this[0];
        var chart = new Chart(options);
        return this;
    };
}