/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Chart} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/Chart 
 * @requires        charts/EventHandler
 * @requires        charts/datatip
 * @requires        series/Series
 * @requires        canvas/Canvas
 * @requires        geom/CartesianCoords
 * @requires        geom/PolarCoords
 * @requires        utils/util
 * @requires        utils/dom
 * @requires        utils/svg
 * @requires        utils/color
 */

// Required modules.
var EventHandler        = require('./EventHandler');
var Datatip             = require('./Datatip');
var Canvas              = require('../canvas/Canvas');
var CartesianCoords     = require('../geom/CartesianCoords');
var PolarCoords         = require('../geom/PolarCoords');
var Series              = require('../series/Series');
var util                = require('../utils/util');
var dom                 = require('../utils/dom');
var colorUtil           = require('../utils/color');

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
 * @param {string}      [options.renderer = svg]                The graphics renderer. Possible values are 'canvas' or 'svg'.
 * @param {string}      [options.refreshRate = 250]              The rate in ms that graphics are rendered when the chart is resized.
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
            var bounds = dom.bounds(me._canvasContainer);       
            me.setSize(bounds.width, bounds.height);
        }, me._options.refreshRate);
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
 * @param {string}      [options.renderer = svg]                The graphics renderer. Possible values are 'canvas' or 'svg'.
 * @param {string}      [options.refreshRate = 250]             The rate in ms that graphics are refreshed when the chart is resized.
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
        this._options = // Default chart options.
        {
            container           : undefined,
            coordinateSystem    : 'cartesian',
            renderer            : 'svg',
            refreshRate         : 250,
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
        if (options.chart.border !== undefined) util.extendObject(options.chart.border, this._options.border, false);
        util.extendObject(this._options, options.chart);

        // Holds the canvases.
        this._arrCanvas = [];

        // Get the coords object for the given coordinate system.
        if (this._options.coordinateSystem === 'polar') this._coords = new PolarCoords();     // Polar.
        else                                            this._coords = new CartesianCoords(); // Cartesian.    

        // Container for holding the drawing canvases. We need a relative positioned container so we can stack canvases inside it using absolute positioning.
        this._canvasContainer  = dom.createElement('div');
        dom.style(this._canvasContainer , {position : 'relative', width:'100%', height:'100%'});
        dom.appendChild(this._options.container, this._canvasContainer);

        // Chart formatting.
        this.addChartFormatting(this._options);

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
        this._uiCanvas = this.addCanvas();

        // Event handler.
        this.addEventHandler(this._options);

        // Set charts size to that of the container - it will subsequently be rendered.
        var bounds = dom.bounds(this._canvasContainer);       
        this.setSize(bounds.width, bounds.height);

        this._datatip = new Datatip(this._canvasContainer);

        return this;
    }
    else return this._options;
};

/** 
 * Add a canvas.
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
 * Add chart formatting.
 *
 * @since 0.1.0
 * @private
 */
Chart.prototype.addChartFormatting = function (options)
{
    // Background canvas.
    this._backgroundCanvas = this.addCanvas();

    // Background elements.
    if (options.background !== undefined) 
    {
        this._background = this._backgroundCanvas.rect();
        this._background.style = options.background;
    }

    // Border elements.
    util.extendObject(options.borderTop,    options.border, false);
    util.extendObject(options.borderRight,  options.border, false);
    util.extendObject(options.borderBottom, options.border, false);
    util.extendObject(options.borderLeft,   options.border, false);
    this._borderTop           = this._backgroundCanvas.line();
    this._borderRight         = this._backgroundCanvas.line();
    this._borderBottom        = this._backgroundCanvas.line();
    this._borderLeft          = this._backgroundCanvas.line();
    this._borderTop.style     = options.borderTop;
    this._borderRight.style   = options.borderRight;
    this._borderBottom.style  = options.borderBottom;
    this._borderLeft.style    = options.borderLeft;

    // Padding elements.
    options.paddingTop    = options.paddingTop !== undefined ? options.paddingTop : options.padding;
    options.paddingRight  = options.paddingRight !== undefined ? options.paddingRight : options.padding;
    options.paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding;
    options.paddingLeft   = options.paddingTop !== undefined ? options.paddingTop : options.padding;
};

/** 
 * Add the event handler.
 *
 * @since 0.1.0
 * @private
 */
Chart.prototype.addEventHandler = function (options)
{
    var me = this;

    // Event handler
    var eventHandler = new EventHandler(
    {
        element : this._canvasContainer,
        coords  : this._coords,
        mouseclick : function (event)
        {

        },
        mousedown : function (event)
        {

        },
        mouseup : function (event)
        {

        },
        mousemove : function (event)
        {
            updateTip(event);
            me._datatip.show();
        },
        mouseover : function (event)
        {

        },
        mouseout : function (event)
        {
            me._datatip.fadeOut();    
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        mousedragstart : function (event)
        {
            me._datatip.hide();
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        mousedrag : function (event)
        {

        },
        mousedragend : function (event)
        {   

        },
        touchdown : function (event)
        {

        },
        touchdownoutside : function (event)
        {
            me._datatip.fadeOut();    
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        touchdragstart : function (event)
        {
            me._datatip.hide();
            me._uiCanvas.empty();
            me.hitX = undefined;
            me.hitY = undefined;
        },
        touchup : function (event)
        {
            updateTip(event);
            me._datatip.show();
        }
    });

    function updateTip(event)
    { 
        var hitEvent = me.hitEvent(event.pixelX, event.pixelY);
        if (hitEvent !== undefined && (hitEvent.pixelX !== me.hitX || hitEvent.pixelY !== me.hitY))
        {
            me._uiCanvas.empty();
            me.hitX = hitEvent.pixelX;
            me.hitY = hitEvent.pixelY;



            var highlightItem = util.cloneObject(hitEvent.items[0]);
            me._uiCanvas.addItem(highlightItem);

            if (highlightItem.marker === true)
            {
                highlightItem.style.fillOpacity = 0.3;
                highlightItem.style.lineColor   = highlightItem.style.fillColor;
                highlightItem.coords.size       = highlightItem.coords.size * 2;
            }
            else if (highlightItem.shape === true)
            {

            }

            //me._datatip.html('1')
           //me._datatip.html(highlightItem.coords.cx+' '+highlightItem.coords.cy)
            me._datatip.options({borderColor : highlightItem.style.fillColor, position: 'top'})
            .html('Tooltip that should always be visible in viewport X and its just too long: '+highlightItem.coords.cx+ 
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+highlightItem.coords.cy+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+highlightItem.coords.cx+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+highlightItem.coords.cy+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+highlightItem.coords.cx+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+highlightItem.coords.cy)
            .position(hitEvent.pixelX, hitEvent.pixelY);

            me._uiCanvas.render();
        }

            /*me._datatip.html('Tooltip that should always be visible in viewport X and its just too long: '+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: '+
                ' <br/> Tooltip that should always be visible in viewport X and its just too long: '+
                ' <br/> Tooltip that should always be visible in viewport Y and its just really long: ');
            me._datatip.position(event.pixelX, event.pixelY, 'top');*/

    }
};

/** 
 * Returns a hit event for the nearest item.
 *
 * @since 0.1.0
 *
 * @param {number} x The x pixel coord.
 * @param {number} y The y pixel coord.
 *
 * @return {CanvasItem} The canvas item.
 */
Chart.prototype.hitEvent = function(x, y)
{
    var nearestEvent;
    var shortestDistance = Infinity;
    for (var i = 0; i < this._series.length; i++)  
    {
        var s = this._series[i];
        var event = s.hitEvent(x, y);
        if (event.distance < shortestDistance) 
        {
            nearestEvent = event; 
            shortestDistance = event.distance;
        }
    }
    return nearestEvent;
};

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

    // Set the canvas sizes.
    for (var i = 0; i < this._arrCanvas.length; i++)  {this._arrCanvas[i].setSize(w, h);}

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