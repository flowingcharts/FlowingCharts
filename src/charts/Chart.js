/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Chart} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/Chart 
 * @requires        series/Series
 * @requires        canvas/Canvas
 * @requires        geom/CartesianCoords
 * @requires        geom/PolarCoords
 * @requires        utils/util
 * @requires        utils/dom
 * @requires        utils/svg
 */

// Required modules.
var Canvas              = require('../canvas/Canvas');
var CartesianCoords     = require('../geom/CartesianCoords');
var PolarCoords         = require('../geom/PolarCoords');
var Series              = require('../series/Series');
var util                = require('../utils/util');
var dom                 = require('../utils/dom');
var svg                 = require('../utils/svg');

/** 
 * @classdesc A base class for charts.
 *
 * @class
 * @alias Chart
 * @since 0.1.0
 * @constructor
 *
 * @param {Object}      options                                 The chart options.
 * @param {HTMLElement} options.container                       The html element that will contain the chart.
 * @param {string}      [options.coordinateSystem = cartesian]  The coordinate system. Possible values are 'cartesian' or 'polar'.
 * @param {string}      [options.renderer = canvas]             The graphics renderer. Possible values are 'canvas' or 'svg'.
 * @param {string}      [options.renderRate = 250]              The rate in ms that graphics are rendered when the chart is resized.
 */
function Chart (options)
{
    // Private instance members.  
    this._options = // Default options.
    {
        container           : undefined,
        coordinateSystem    : 'cartesian',
        renderer            : 'canvas',
        renderRate          : 20,
        padding             : 50,
        paddingTop          : undefined,
        paddingRight        : undefined,
        paddingBottom       : undefined,
        paddingLeft         : undefined,
        background          : 
        {
            fillColor   :'#cccccc',
            fillOpacity : 0.5
        },
        border              : 
        {
            lineWidth   : 1,
            lineColor   :'#cccccc'
        },
        borderTop           : undefined,
        borderRight         : undefined,
        borderBottom        : undefined,
        borderLeft          : undefined
    };

    // Public instance members.  
    this.series = [];

    // Parent html element.
    var container = options.container;
    dom.empty(container);

    // Resize the chart to fit the container when the window resizes.
    var me = this;
    var resizeTimeout;
    window.addEventListener('resize', function (event)
    {
        // Add a resizeTimeout to stop multiple calls to setSize().
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function ()
        {        
            me.setSize(container.offsetWidth, container.offsetHeight);
        }, me._options.renderRate);
    });

    this.options(options);
}

/** 
 * Get or set the options for the chart.
 *
 * @since 0.1.0
 *
 * @param {Object}      options                                 The chart options.
 * @param {HTMLElement} options.container                       The html element that will contain the chart.
 * @param {string}      [options.coordinateSystem = cartesian]  The coordinate system. Possible values are 'cartesian' or 'polar'.
 * @param {string}      [options.renderer = canvas]             The graphics renderer. Possible values are 'canvas' or 'svg'.
 * @param {string}      [options.renderRate = 250]              The rate in ms that graphics are rendered when the chart is resized.
 *
 * @return {Object|Series}                                      The options if no arguments are supplied, otherwise <code>this</code>.
 */
Chart.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        // Extend default options with passed in options.
        util.extendObject(this._options, options);

        // Padding.
        this._options.paddingTop    = this._options.paddingTop !== undefined ? this._options.paddingTop : this._options.padding;
        this._options.paddingRight  = this._options.paddingRight !== undefined ? this._options.paddingRight : this._options.padding;
        this._options.paddingBottom = this._options.paddingBottom !== undefined ? this._options.paddingBottom : this._options.padding;
        this._options.paddingLeft   = this._options.paddingTop !== undefined ? this._options.paddingTop : this._options.padding;

        // Border style.
        this._options.borderTop    = this._options.borderTop !== undefined ? this._options.borderTop : this._options.border;
        this._options.borderRight  = this._options.borderRight !== undefined ? this._options.borderRight : this._options.border;
        this._options.borderBottom = this._options.borderBottom !== undefined ? this._options.borderBottom : this._options.border;
        this._options.borderLeft   = this._options.borderLeft !== undefined ? this._options.borderLeft : this._options.border;

        // Coordinate system.
        this.coords = getCoords(this._options.coordinateSystem);

        // Container for holding the drawing canvases.
        this._canvasContainer = getCanvasContainer(this._options.renderer);
        dom.appendChild(this._options.container, this._canvasContainer);

        // Background and border canvas.
        this._canvas = getCanvas(this._options.renderer);
        this._canvas.appendTo(this._canvasContainer);   
        this._background    = this._canvas.rect().style(this._options.background);
        this._borderTop     = this._canvas.line().style(this._options.border);
        this._borderRight   = this._canvas.line().style(this._options.border);
        this._borderBottom  = this._canvas.line().style(this._options.border);
        this._borderLeft    = this._canvas.line().style(this._options.border);

        // Series.
        this.series = [];
        if (this._options.series)
        {
            for (var i = 0; i < this._options.series.length; i++)  
            {
                // Create a canvas for the series.
                var seriesCanvas = getCanvas(this._options.renderer, this.coords); 
                seriesCanvas.appendTo(this._canvasContainer);   

                // Create the series.
                var s = new Series(seriesCanvas, this._options.series[i]);
                this.series.push(s);                    
            }
        }

        // Set charts size to that of the container - it will subsequently be rendered.
        // TODO What happens if the container has padding applied to it.
        // http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
        this.setSize(this._options.container.offsetWidth, this._options.container.offsetHeight);

        return this;
    }
    else return this._options;
};

/** 
 * Get the coords object for the given coordinate system.
 *
 * @since 0.1.0
 * @private
 *
 * @param {string} [coordinateSystem = cartesian] The coordinate system 'cartesian' or 'polar'.
 *
 * @return {CartesianCoords|PolarCoords}          The container.
 */
function getCoords(coordinateSystem)
{
    if (coordinateSystem === 'polar') return new PolarCoords();     // Polar.
    else                              return new CartesianCoords(); // Cartesian.    
}

/** 
 * Returns a container for holding canvases.
 *
 * @since 0.1.0
 * @private
 *
 * @param {string} [renderer = canvas] The renderer 'svg' or 'canvas'.
 *
 * @return {HTMLElement|SVGElement}    The container.
 */
function getCanvasContainer(renderer)
{
    if (renderer === 'svg') return svg.createElement('svg');                                    // SVG.
    else                    return dom.createElement('div', {style : {position : 'relative'}}); // Canvas.
    // For 'canvas' we need a relative positioned container so we can stack html5 canvases inside it using absolute positioning.
}

/** 
 * Get the canvas for the given renderer.
 *
 * @since 0.1.0
 * @private
 *
 * @param {string}                      [renderer = canvas] The renderer 'svg' or 'canvas'.
 * @param {CartesianCoords|PolarCoords} coords              The coords to apply to the canvas.
 *
 * @return {HtmlCanvas|SvgCanvas}                           The canvas.
 */
function getCanvas(renderer, coords)
{
    return new Canvas(renderer, coords);
}

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 * @private
 *
 * @param {number} w The width.
 * @param {number} h The height.
 */
Chart.prototype.setSize = function (w, h)
{
    //<validation>
    if (!util.isNumber(w))  throw new Error('Chart.setSize(w): w must be a number.');
    if (w < 0)              throw new Error('Chart.setSize(w): w must be >= 0.');
    if (!util.isNumber(h))  throw new Error('Chart.setSize(h): h must be a number.');
    if (h < 0)              throw new Error('Chart.setSize(h): h must be >= 0.');
    //</validation>

    // viewPort.
    var x1Chart = this._options.paddingLeft;
    var y1Chart = this._options.paddingTop;
    var x2Chart = w - this._options.paddingRight;
    var y2Chart = h - this._options.paddingBottom;
    var wChart  = x2Chart - x1Chart;
    var hChart  = y2Chart - y1Chart;
    this.coords.viewPort(x1Chart, y1Chart, wChart, hChart);

    // Set the canvas container size.
    dom.attr(this._canvasContainer, {width:w, height:h});

    // Set the coords for the background and border.
    this._background.coords    = {x:x1Chart,  y:y1Chart, width:wChart, height:hChart};
    this._borderTop.coords     = {x1:x1Chart, y1:y1Chart, x2:x2Chart, y2:y1Chart};
    this._borderRight.coords   = {x1:x2Chart, y1:y1Chart, x2:x2Chart, y2:y2Chart};
    this._borderBottom.coords  = {x1:x1Chart, y1:y2Chart, x2:x2Chart, y2:y2Chart};
    this._borderLeft.coords    = {x1:x1Chart, y1:y1Chart, x2:x1Chart, y2:y2Chart};

    // Set the chart canvas size.
    this._canvas.setSize(w, h);

    // Set the series canvas sizes.
    for (var i = 0; i < this.series.length; i++)  
    {
        if (this._options.renderer !== 'svg') this.series[i].canvas.setSize(w, h);
    }

    this.render();
};

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 */
Chart.prototype.render = function()
{
    window.console.log("render");

    // Set the viewbox.
    var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    var n = this.series.length;
    for (var i = 0; i < n; i++)  
    {
        var s = this.series[i];
        xMin = Math.min(xMin, s.xMin);
        xMax = Math.max(xMax, s.xMax);
        yMin = Math.min(yMin, s.yMin);
        yMax = Math.max(yMax, s.yMax);
    }
    this.coords.viewBox(xMin, yMin, xMax, yMax);

    // Render the background and border.
    this._canvas.render();

    // Render the series.
    for (i = 0; i < n; i++)  
    {
        this.series[i].render();
    }
};

// TODO Event handlers - could be added to canvas so Series can make use of it.
Chart.prototype.on = function (strEvents, fncHandler)
{
    return this;
};

module.exports = Chart;