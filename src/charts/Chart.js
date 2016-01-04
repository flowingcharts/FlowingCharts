/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Chart} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/Chart 
 * @requires        charts/EventHandelr
 * @requires        series/Series
 * @requires        canvas/Canvas
 * @requires        geom/CartesianCoords
 * @requires        geom/PolarCoords
 * @requires        utils/util
 * @requires        utils/dom
 * @requires        utils/svg
 */

// Required modules.
var EventHandler        = require('./EventHandler');
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
 * @param {number}      [options.padding = 20]                  The chart padding.
 * @param {number}      [options.paddingTop]                    The chart top padding.
 * @param {number}      [options.paddingRight]                  The chart right padding.
 * @param {number}      [options.paddingBottom]                 The chart bottom padding.
 * @param {number}      [options.paddingLeft]                   The chart left padding.
 * @param {number}      [options.border]                        The chart border.
 * @param {number}      [options.borderTop]                     The chart top border.
 * @param {number}      [options.borderRight]                   The chart right border.
 * @param {number}      [options.borderBottom]                  The chart bottom border.
 * @param {number}      [options.borderLeft]                    The chart left border.
 * @param {number}      [options.background]                    The chart background.
 */
function Chart (options)
{
    // Parent html element.
    var container = options.chart.container;
    dom.empty(container);

    // Resize the chart to fit the container when the window resizes.
    var me = this;
    var resizeTimeout;
    dom.on(window, 'resize', function (event)
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
 * @param {number}      [options.padding = 20]                  The chart padding.
 * @param {number}      [options.paddingTop]                    The chart top padding.
 * @param {number}      [options.paddingRight]                  The chart right padding.
 * @param {number}      [options.paddingBottom]                 The chart bottom padding.
 * @param {number}      [options.paddingLeft]                   The chart left padding.
 * @param {number}      [options.border]                        The chart border.
 * @param {number}      [options.borderTop]                     The chart top border.
 * @param {number}      [options.borderRight]                   The chart right border.
 * @param {number}      [options.borderBottom]                  The chart bottom border.
 * @param {number}      [options.borderLeft]                    The chart left border.
 * @param {number}      [options.background]                    The chart background.
 *
 * @return {Object|Chart}                                       The options if no arguments are supplied, otherwise <code>this</code>.
 */
Chart.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        var me = this;

        this._options = // Default chart options.
        {
            container           : undefined,
            coordinateSystem    : 'cartesian',
            renderer            : 'canvas',
            renderRate          : 20,
            padding             : 20,
            paddingTop          : undefined,
            paddingRight        : undefined,
            paddingBottom       : undefined,
            paddingLeft         : undefined,
            border              : {lineColor : '#cccccc'},
            borderTop           : {lineWidth : 0},
            borderRight         : {lineWidth : 0},
            borderBottom        : {lineWidth : 1},
            borderLeft          : {lineWidth : 1},
            background          : undefined
        };

        // Extend default options with passed in options.
        if (options.chart.border !== undefined) util.addProperties(options.chart.border, this._options.border);
        util.extendObject(this._options, options.chart);

        // Holds the canvases.
        this._arrCanvas = [];

        // Coordinate system.
        this._coords = getCoords(this._options.coordinateSystem);

        // Container for holding the drawing canvases.
        this._canvasContainer = getCanvasContainer(this._options.renderer);
        dom.appendChild(this._options.container, this._canvasContainer);

        // Background canvas.
        this._backgroundCanvas = this.addCanvas();

        // Series.
        this._series = [];
        if (options.series)
        {
            for (var i = 0; i < options.series.length; i++)  
            {
                // Create a canvas for the series.
                var seriesCanvas = this.addCanvas();

                // Create the series.
                var s = new Series(seriesCanvas, options.series[i]);
                this._series.push(s);                    
            }
        }

        // Interaction canvas.
        this._interactionCanvas = this.addCanvas();

        // Background elements.
        if (this._options.background !== undefined) this._background = this._backgroundCanvas.rect().style(this._options.background);

        // Border elements.
        util.addProperties(this._options.borderTop,    this._options.border);
        util.addProperties(this._options.borderRight,  this._options.border);
        util.addProperties(this._options.borderBottom, this._options.border);
        util.addProperties(this._options.borderLeft,   this._options.border);
        this._borderTop    = this._backgroundCanvas.line().style(this._options.borderTop);
        this._borderRight  = this._backgroundCanvas.line().style(this._options.borderRight);
        this._borderBottom = this._backgroundCanvas.line().style(this._options.borderBottom);
        this._borderLeft   = this._backgroundCanvas.line().style(this._options.borderLeft);

        // Padding elements.
        this._options.paddingTop    = this._options.paddingTop !== undefined ? this._options.paddingTop : this._options.padding;
        this._options.paddingRight  = this._options.paddingRight !== undefined ? this._options.paddingRight : this._options.padding;
        this._options.paddingBottom = this._options.paddingBottom !== undefined ? this._options.paddingBottom : this._options.padding;
        this._options.paddingLeft   = this._options.paddingTop !== undefined ? this._options.paddingTop : this._options.padding;

        // Event handler
        var eventHandler = new EventHandler(
        {
            element : this._canvasContainer,
            coords  : this._coords,
            click : function (dataEvent)
            {

            },
            mousedown : function (dataEvent)
            {

            },
            mouseup : function (dataEvent)
            {

            },
            mousemove : function (dataEvent)
            {
                var hitItem;
                for (var i = 0; i < me._series.length; i++)  
                {
                    var s = me._series[i];
                    hitItem = s.hitItem(dataEvent.dataX, dataEvent.dataY);
                }

                me._interactionCanvas.empty();
                if (hitItem !== undefined) 
                {
                    var highlightItem = hitItem.clone();
                    me._interactionCanvas.addItem(highlightItem);

                    highlightItem.lineWidth = 3;
                    highlightItem.lineColor = '#cccccc';


                   /* highlightItem.style(
                    {
                        lineWidth : 3,
                        lineColor : '#cccccc'
                    });*/

                    highlightItem.coords.size = highlightItem.coords.size * 1.3;
                    window.console.log(highlightItem);

                    me._interactionCanvas.render();
                }
            },
            mouseout : function (dataEvent)
            {
                me._interactionCanvas.empty();
            },
            mousedragstart : function (dataEvent)
            {
                me._interactionCanvas.empty();
            }
        });

        // Set charts size to that of the container - it will subsequently be rendered.
        // TODO What happens if the container has padding applied to it.
        // http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
        this.setSize(this._options.container.offsetWidth, this._options.container.offsetHeight);

        return this;
    }
    else return this._options;
};

/** 
 * Adds a canvas.
 *
 * @since 0.1.0
 * @private
 *
 * @return {Canvas} The added canvas.
 */
Chart.prototype.addCanvas = function()
{
    var canvas = new Canvas(this._options.renderer, this._coords);
    canvas.appendTo(this._canvasContainer);   
    this._arrCanvas.push(canvas);
    return canvas;
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

    // Set the viewPort.
    var x1Chart = this._options.paddingLeft;
    var y1Chart = this._options.paddingTop;
    var x2Chart = w - this._options.paddingRight;
    var y2Chart = h - this._options.paddingBottom;
    var wChart  = x2Chart - x1Chart;
    var hChart  = y2Chart - y1Chart;
    this._coords.viewPort(x1Chart, y1Chart, wChart, hChart);

    // Set the coords for the background and border elements.
    if (this._background !== undefined)     this._background.coords    = {x:x1Chart,  y:y1Chart, width:wChart, height:hChart};
    if (this._borderTop !== undefined)      this._borderTop.coords     = {x1:x1Chart, y1:y1Chart, x2:x2Chart, y2:y1Chart};
    if (this._borderRight !== undefined)    this._borderRight.coords   = {x1:x2Chart, y1:y1Chart, x2:x2Chart, y2:y2Chart};
    if (this._borderBottom !== undefined)   this._borderBottom.coords  = {x1:x1Chart, y1:y2Chart, x2:x2Chart, y2:y2Chart};
    if (this._borderLeft !== undefined)     this._borderLeft.coords    = {x1:x1Chart, y1:y1Chart, x2:x1Chart, y2:y2Chart};

    // Set the canvas container size.
    dom.attr(this._canvasContainer, {width:w, height:h});

    // Set the canvas sizes.
    for (var i = 0; i < this._arrCanvas.length; i++)  
    {
        this._arrCanvas[i].setSize(w, h);
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
    var n = this._series.length;
    for (var i = 0; i < n; i++)  
    {
        var s = this._series[i];
        xMin = Math.min(xMin, s.xMin);
        xMax = Math.max(xMax, s.xMax);
        yMin = Math.min(yMin, s.yMin);
        yMax = Math.max(yMax, s.yMax);
    }
    this._coords.viewBox(xMin, yMin, xMax, yMax);

    // Render the canvases.
    for (var j = 0; j < this._arrCanvas.length; j++)  
    {
        this._arrCanvas[j].render();
    }
};

module.exports = Chart;