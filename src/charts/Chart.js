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
    this._options = null; // The options.

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
        // Default options.
        this._options = 
        {
            container           : null,
            coordinateSystem    : 'cartesian',
            renderer            : 'canvas',
            renderRate          : 20
        };
        // Extend default options with passed in options.
        extendObject(this._options, options);

        // Parent html element.
        var container = this._options.container;

        // Coordinate system.
        if (options.coordinateSystem === 'polar')   
            this.coords = new PolarCoords();     // Polar.
        else                                        
            this.coords = new CartesianCoords(); // Cartesian.                     

        // Series container.
        if (this._options.renderer === 'svg')       
            this._seriesContainer = createSvgElement('svg'); // SVG.
        else       
        {
            this._seriesContainer = createElement('div',     // Canvas.
            {
                style : {position : 'relative'} // Need a relative container so we can stack html5 canvases with absolute positioning.
            }); 
        }                                 

        container.appendChild(this._seriesContainer);

        // Series.
        this.series = [];
        if (this._options.series)
        {
            for (var i = 0; i < this._options.series.length; i++)  
            {
                var seriesCanvas;
                if (this._options.renderer === 'svg')   
                    seriesCanvas = new SvgCanvas(this.coords);  // SVG.
                else                                    
                    seriesCanvas = new HtmlCanvas(this.coords); // Canvas.

                var s = new Series(seriesCanvas, this._options.series[i]);

                seriesCanvas.appendTo(this._seriesContainer);   
                this.series.push(s);                    
            }
        }

        // Set charts initial size to that of the container.
        // TODO What happens if the container has padding applied to it.
        // http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
        this.setSize(container.offsetWidth, container.offsetHeight);

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

        return this;
    }
    else return this._options;
};

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
    this._seriesContainer.setAttribute('width', w);
    this._seriesContainer.setAttribute('height', h);

    // Set the series canvas sizes.
    for (var i = 0; i < this.series.length; i++)  
    {
        if (this._options.renderer !== 'svg') this.series[i].canvas.setSize(w, h);
    }

    // viewPort.
    var leftMargin = 40;
    var rightMargin = 40;
    var topMargin = 40;
    var bottomMargin = 40;
    var x = leftMargin;
    var y = topMargin;
    var width = w - (leftMargin + rightMargin);
    var height = h - (topMargin + bottomMargin);

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

    // Render the series.
    for (i = 0; i < n; i++)  
    {
        this.series[i].render();
    }

    // TODO Loop thru and render axes labels etc.
};

// TODO Event handlers - could be added to canvas so Series can make use of it.
Chart.prototype.on = function (strEvents, fncHandler)
{
    return this;
};

module.exports = Chart;