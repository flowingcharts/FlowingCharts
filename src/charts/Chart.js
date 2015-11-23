/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Chart} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module charts/Chart 
 * @requires series/Series
 * @requires canvas/HtmlCanvas
 * @requires canvas/HtmlCanvas
 * @requires geom/CartesianCoords
 * @requires geom/PolarCoords
 * @requires util/Series
 */

// Required modules.
var HtmlCanvas      = require('../canvas/HtmlCanvas');
var SvgCanvas       = require('../canvas/SvgCanvas');
var CartesianCoords = require('../geom/CartesianCoords');
var PolarCoords     = require('../geom/PolarCoords');
var Series          = require('../series/Series');
var util            = require('../util');
var isNumber        = util.isNumber;

/** 
 * @classdesc A base class for charts.
 *
 * @class
 * @alias Chart
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The options.
 */
function Chart (options)
{
    var container = options.container;

    // Coordinate system.
    this._coords = null;
    if (options.coordinateSystem === 'polar')
        this._coords = new PolarCoords(); // polar.
    else      
        this._coords = new CartesianCoords(); // cartesian.                     

    // Canvas type.
    this._canvas = null;
    if (options.renderer === 'svg')
        this._canvas = new SvgCanvas(this._coords); // svg.
    else                            
        this._canvas = new HtmlCanvas(this._coords); // canvas.

    // Series.
    this.series = [];
    if (options.series)
    {
        var series = options.series;
        for (var i = 0; i < series.length; i++)  
        {
            var s = new Series(this._coords);
            this.series.push(s);
        }
    }

    // Append canvas to container and set its initial size to that of the container.
    this._canvas.appendTo(container);
    this.setSize(container.offsetWidth, container.offsetHeight);

    // Resize the canvas to fit the container when the window resizes.
    var me = this;
    var resizeTimeout;
    window.addEventListener('resize', function (event)
    {
        // Add a resizeTimeout to stop multiple calls to setSize().
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function ()
        {        
            me.setSize(container.offsetWidth, container.offsetHeight);
        }, 20);
    });

    // TODO Remove this.
    this._coords.viewBox(0, 0, 100, 100);
    this.render();
}

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 * @param {number} w The width.
 * @param {number} h The height.
 */
Chart.prototype.setSize = function (w, h)
{
    //<validation>
    if (!isNumber(w)) throw new Error('Chart.setSize(w): w must be a number.');
    if (w < 0)        throw new Error('Chart.setSize(w): w must be >= 0.');
    if (!isNumber(h)) throw new Error('Chart.setSize(h): h must be a number.');
    if (h < 0)        throw new Error('Chart.setSize(h): h must be >= 0.');
    //</validation>

    if (w !== this._canvas.width() || h !== this._canvas.height())
    {
        this._canvas.setSize(w, h);

        // viewPort.
        var leftMargin = 40;
        var rightMargin = 40;
        var topMargin = 40;
        var bottomMargin = 40;
        var x = leftMargin;
        var y = topMargin;
        var width = w - (leftMargin + rightMargin);
        var height = h - (topMargin + bottomMargin);

        this._coords.viewPort(x, y, width, height);
        this.render();
    }
};

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 */
Chart.prototype.render = function()
{
    // TODO For svg we dont want to clear - just change attributes of current dom.
    this._canvas.clear();
    this._canvas.rect(0, 0, 50, 50).fillColor('#00f500').lineWidth(15).fill().stroke();
    this._canvas.ellipse(10, 10, 80, 50).fillColor('#f50000').lineWidth(15).fillOpacity(0.7).fill().stroke();
    this._canvas.circle(50, 50, 50).fillColor('#0000f5').fill().stroke({width:12});
    this._canvas.polygon([50, 0, 100, 0, 100, 50]).fillColor('#0ff0f5').fill().stroke();
    this._canvas.marker('square', 0, 0, 100).fillColor('#fff500').lineWidth(2).fill().stroke();
    this._canvas.marker('circle', 0, 0, 100).fillColor('#ccf500').lineWidth(2).fill().stroke();

    // TODO Loop thru and render series, axes labels etc.
    for (var i = 0; i < this.series.length; i++)  
    {
        var s = this.series[i];
        s.render();
    }
};

// TODO Event handlers - could be added to canvas so Series can make use of it.
Chart.prototype.on = function (strEvents, fncHandler)
{
    return this;
};

module.exports = Chart;