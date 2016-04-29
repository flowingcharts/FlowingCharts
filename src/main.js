/* jshint browserify: true */
'use strict';

/**
 * @fileoverview    Creates standalone class for flowingcharts.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          main 
 * @requires        utils/dom
 * @requires        charts/Chart
 * @requires        plugins/jqueryplugin
 */

// Required modules.
var $           = require('jQuery');
var dom         = require('./utils/dom');
var ChartBase   = require('./charts/Chart');

// For jquery.
if ($ !== undefined)
{
    $.fn.flowingcharts = function (options) 
    {   
        options.chart.container = this[0];
        var chart = new ChartBase(options);
        return this;
    };
}

/** 
 * Creates a new chart.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} parentElement   The chart container.
 * @param {Object}      options         The chart options.
 */
var chart = function (container, options)
{
    options.chart.container = dom.getElement(container);
    return new ChartBase(options);
};

module.exports = 
{
    chart : chart
};