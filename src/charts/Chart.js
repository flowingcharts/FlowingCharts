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
 * @requires canvas/SvgCanvas
 * @requires geom/CartesianCoords
 * @requires geom/PolarCoords
 * @requires utils/util
 * @requires utils/dom
 */

// Required modules.
var HtmlCanvas          = require('../canvas/HtmlCanvas');
var SvgCanvas           = require('../canvas/SvgCanvas');
var CartesianCoords     = require('../geom/CartesianCoords');
var PolarCoords         = require('../geom/PolarCoords');
var Series              = require('../series/Series');
var util                = require('../utils/util');
var isNumber            = util.isNumber;
var extendObject        = util.extendObject;
var dom                 = require('../utils/dom');
var createSvgElement    = dom.createSvgElement;
var createElement       = dom.createElement;
var empty               = dom.empty;

/** 
 * @classdesc A base class for charts.
 *
 * @class
 * @alias Chart
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The chart options.
 * @param {HTMLElement} options.container The html element that will contain the chart.
 * @param {string} [options.coordinateSystem = 'cartesian'] The coordinate system. Possible values are 'cartesian' or 'polar'.
 * @param {string} [options.renderer = 'canvas'] The graphics renderer. Possible values are 'canvas' or 'svg'.
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
        borderWidth         : 1,
        borderTopWidth      : undefined,
        borderRightWidth    : undefined,
        borderBottomWidth   : undefined,
        borderLeftWidth     : undefined,
        borderColor         : '#cccccc',
        borderTopColor      : undefined,
        borderRightColor    : undefined,
        borderBottomColor   : undefined,
        borderLeftColor     : undefined,
        backgroundColor     : undefined
    };

    // Public instance members.  
    this.series = [];

    // Parent html element.
    var container = options.container;
    empty(container);

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
 * @param {Object} [options] The chart options.
 * @param {HTMLElement} options.container The html element that will contain the chart.
 * @param {string} [options.coordinateSystem = 'cartesian'] The coordinate system. Possible values are 'cartesian' or 'polar'.
 * @param {string} [options.renderer = 'canvas'] The graphics renderer. Possible values are 'canvas' or 'svg'.
 * @param {string} [options.renderRate = 250] The rate in ms that graphics are rendered when the chart is resized.
 * @return {Object|Series} The options if no arguments are supplied, otherwise <code>this</code>.
 */
Chart.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        // Extend default options with passed in options.
        extendObject(this._options, options);

        // Padding.
        this._options.paddingTop    = this._options.paddingTop !== undefined ? this._options.paddingTop : this._options.padding;
        this._options.paddingRight  = this._options.paddingRight !== undefined ? this._options.paddingRight : this._options.padding;
        this._options.paddingBottom = this._options.paddingBottom !== undefined ? this._options.paddingBottom : this._options.padding;
        this._options.paddingLeft   = this._options.paddingTop !== undefined ? this._options.paddingTop : this._options.padding;

        // Border width.
        this._options.borderTopWidth     = this._options.borderTopWidth !== undefined ? this._options.borderTopWidth : this._options.borderWidth;
        this._options.borderRightWidth   = this._options.borderRightWidth !== undefined ? this._options.borderRightWidth : this._options.borderWidth;
        this._options.borderBottomWidth  = this._options.borderBottomWidth !== undefined ? this._options.borderBottomWidth : this._options.borderWidth;
        this._options.borderLeftWidth    = this._options.borderLeftWidth !== undefined ? this._options.borderLeftWidth : this._options.borderWidth;

        // Border color.
        this._options.borderTopColor     = this._options.borderTopColor !== undefined ? this._options.borderTopColor : this._options.borderColor;
        this._options.borderRightColor   = this._options.borderRightColor !== undefined ? this._options.borderRightColor : this._options.borderColor;
        this._options.borderBottomColor  = this._options.borderBottomColor !== undefined ? this._options.borderBottomColor : this._options.borderColor;
        this._options.borderLeftColor    = this._options.borderLeftColor !== undefined ? this._options.borderLeftColor : this._options.borderColor;

        // Coordinate system.
        this.coords = getCoords(this._options.coordinateSystem);

        // Container for holding the drawing canvases.
        this._canvasContainer = getCanvasContainer(this._options.renderer);
        this._options.container.appendChild(this._canvasContainer);

        // Axis canvas
        var axisCanvas = getCanvas(this._options.renderer, this.coords); 

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
 * @param {string} [coordinateSystem = 'cartesian'] The coordinate system 'cartesian' or 'polar'.
 * @return {CartesianCoords|PolarCoords} The container.
 * @private
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
 * @param {string} [renderer = 'canvas'] The renderer 'svg' or 'canvas'.
 * @return {HTMLElement|SVGElement} The container.
 * @private
 */
function getCanvasContainer(renderer)
{
    if (renderer === 'svg') return createSvgElement('svg');                                 // SVG.
    else                    return createElement('div', {style : {position : 'relative'}}); // Canvas.
    // For 'canvas' we need a relative positioned container so we can stack html5 canvases inside it using absolute positioning.
}

/** 
 * Get the canvas for the given renderer.
 *
 * @since 0.1.0
 * @param {string} [renderer = 'canvas'] The renderer 'svg' or 'canvas'.
 * @param {CartesianCoords|PolarCoords} coords The coords to apply to the canvas.
 * @return {HtmlCanvas|SvgCanvas} The canvas.
 * @private
 */
function getCanvas(renderer, coords)
{
    if (renderer === 'svg') return new SvgCanvas(coords);  // SVG.
    else                    return new HtmlCanvas(coords); // Canvas.
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

    // Set the series container size.
    this._canvasContainer.setAttribute('width', w);
    this._canvasContainer.setAttribute('height', h);

    // Set the series canvas sizes.
    for (var i = 0; i < this.series.length; i++)  
    {
        if (this._options.renderer !== 'svg') this.series[i].canvas.setSize(w, h);
    }

    // viewPort.
    var x       = this._options.paddingLeft;
    var y       = this._options.paddingTop;
    var width   = w - (this._options.paddingLeft + this._options.paddingRight);
    var height  = h - (this._options.paddingTop + this._options.paddingBottom);
    this.coords.viewPort(x, y, width, height);

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

    // Render the border


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