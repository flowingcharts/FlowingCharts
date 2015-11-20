/*! flowingcharts v0.1.0 2015-11-19 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Canvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/Canvas 
 * @requires util
 * @requires geom/ViewBox
 * @requires geom/Rectangle
 * @requires geom/Point
 */

// Required modules.
var ViewBox     = require('../geom/ViewBox');
var Rectangle   = require('../geom/Rectangle');
var Point       = require('../geom/Point');
var util        = require('../util');
var isColor     = util.isColor;
var isNumber    = util.isNumber;

/** 
 * @classdesc A base wrapper class for graphics libraries.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function Canvas (options)
{
    // Private instance members.    
    this._viewPort      = new Rectangle();  // The rectangle defining the pixel coords.
    this._viewBox       = new ViewBox();    // The viewBox defining the data coords.
    this._isViewBoxSet  = false;            // Indicates if the viewBox has been set.

    // Default styles.
    this._defaultFillColor       = '#ffffff'; 
    this._defaultFillOpacity     = 1;
    this._defaultLineColor       = '#000000'; 
    this._defaultLineWidth       = 1; 
    this._defaultLineJoin        = 'round';
    this._defaultLineCap         = 'butt';
    this._defaultLineOpacity     = 1;

    // Current styles override default styles.
    this._fillColor             = '#ffffff'; 
    this._fillOpacity           = 1;
    this._lineColor             = '#000000';  
    this._lineWidth             = 1; 
    this._lineJoin              = 'round'; 
    this._lineCap               = 'butt'; 
    this._lineOpacity           = 1; 

    // Public instance members.  


    /** 
     * The html element that represents the actual drawing canvas.
     * 
     * @since 0.1.0
     * @type HTMLElement
     * @default null
     */
    this.canvas = null;

    /** 
     * If set to <code>true</code> the viewBox is adjusted to maintain the aspect ratio.
     * If set to <code>false</code> the viewBox stretches to fill the viewPort.
     * 
     * @since 0.1.0
     * @type boolean
     * @default false
     */
    this.preserveAspectRatio = false;

    // TODO Do we need to add something here to handle no container?
    this._options = options !== undefined ? options : {};

    // Initialise.   
    this.init();

    // Append canvas to container and set its initial size.
    if (this._options.container)
    {
        // Append canvas to parent container.
        var container = this._options.container;
        container.appendChild(this.canvas);

        // Resize the canvas to fit its container and do same when the window resizes.
        this.setSize(container.offsetWidth, container.offsetHeight);
        var me = this;
        var resizeTimeout;
        window.addEventListener('resize', function (event)
        {
            // Add a resizeTimeout to stop multiple calls to setSize().
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function ()
            {        
                me.setSize(container.offsetWidth, container.offsetHeight);
            }, 250);
        });
    }

    // TODO Remove this.
    this.viewBox(0, 0, 100, 100);

    this.render();
}

/** 
 * Initialisation code.
 *
 * @since 0.1.0
 */
Canvas.prototype.init = function()
{

};

// Geometry.

/** 
 * Get the width of the canvas.
 *
 * @since 0.1.0
 * @return {number} The width.
 */
Canvas.prototype.width = function ()
{
    return parseInt(this.canvas.getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
 * @return {number} The height.
 */
Canvas.prototype.height = function ()
{
    return parseInt(this.canvas.getAttribute('height'));
};

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.setSize = function (w, h)
{
    //<validation>
    if (!isNumber(w)) throw new Error('Canvas.setSize(w): w must be a number.');
    if (w < 0)        throw new Error('Canvas.setSize(w): w must be >= 0.');
    if (!isNumber(h)) throw new Error('Canvas.setSize(h): h must be a number.');
    if (h < 0)        throw new Error('Canvas.setSize(h): h must be >= 0.');
    //</validation>

    if (w !== this.width() || h !== this.height())
    {
        // Canvas size.
        this.canvas.setAttribute('width', w);
        this.canvas.setAttribute('height', h);

        // viewPort.
        var leftMargin = 40;
        var rightMargin = 40;
        var topMargin = 40;
        var bottomMargin = 40;
        var x = leftMargin;
        var y = topMargin;
        var width = w - (leftMargin + rightMargin);
        var height = h - (topMargin + bottomMargin);
        this.viewPort(x, y, width, height);

        // Match the viewBox to the viewPort if it hasnt been set using viewBox().
        if (this._isViewBoxSet === false)  this._viewBox.setCoords(0, 0, width, height);

        this.render();
    }
};

/** 
 * A rectangle that defines the drawing area (in pixels) within the canvas.
 *
 * @param {number} [x = 0] The x coord of the top left corner.
 * @param {number} [y = 0] The y coord of the top left corner.
 * @param {number} [width = 100] The width.
 * @param {number} [height = 100] The height.
 * @return {Rectangle|Canvas} A Rectangle that defineds the viewPort if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.viewPort = function (x, y, width, height)
{
    if (arguments.length > 0)
    {
        this._viewPort.setDimensions(x, y, width, height);
        if (this.preserveAspectRatio) this.fitViewBoxToViewPort(this._viewBox, this._viewPort);
        return this;
    }
    else return this._viewPort;
};

/** 
 * The value of the viewBox specifies a rectangle in user space which is mapped to the bounds of the canvas. 
 * The viewBox has its origin at the bottom left corner of the canvas with the 
 * positive x-axis pointing towards the right, the positive y-axis pointing up.
 *
 * @param {number} [xMin = 0] The x coord of the bottom left corner.
 * @param {number} [yMin = 0] The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 * @return {ViewBox|Canvas} The ViewBox if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.viewBox = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._isViewBoxSet = true;
        this._viewBox.setCoords(xMin, yMin, xMax, yMax);
        if (this.preserveAspectRatio) this.fitViewBoxToViewPort(this._viewBox, this._viewPort);
        return this;
    }
    else return this._viewBox;
};

// Styling.

/** 
 * Defines the default stroke style. This can be overridden on a shape by 
 * shape basis by calling [fillColor()]{@link Canvas#fillColor} or [fillOpacity()]{@link Canvas#fillOpacity}.  
 *
 * @since 0.1.0
 * @param {Object} [options] The fill properties.
 * @param {string} [options.color] The fill color.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.fillStyle = function (options)
{
    if (options !== undefined) 
    {
        if (options.color !== undefined)    this._defaultFillColor     = options.color;
        if (options.opacity !== undefined)  this._defaultFillOpacity   = options.opacity;
    }
    return this;
};

/** 
 * Draws a shape by filling its content area. 
 * Style precedence works in the following order:
 * > default styles specified by fillStyle() 
 * > styles specified by methods eg fillColor() 
 * > styles specified in the options param 
 *
 * @since 0.1.0
 * @param {Object} [options] The fill properties.
 * @param {string} [options.color] The fill color.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.fill = function (options)
{
    if (options !== undefined) 
    {
        if (options.color !== undefined)    this.fillColor(options.color);
        if (options.opacity !== undefined)  this.fillOpacity(options.opacity);
    }

    // Call subclass fill routine.
    this.drawFill();

    // Reset to default stroke styles after fill() has completed.
    this.fillColor(this._defaultFillColor).fillOpacity(this._defaultFillOpacity);
    return this;
};

/** 
 * Defines the default fill style. This can be overridden on a shape by 
 * shape basis by calling {@link lineColor()}, {@link lineWidth()}, 
 * {@link lineJoin()}, {@link lineCap()} or {@link lineOpacity()}.  
 *
 * @since 0.1.0
 * @param {Object} [options] The stroke properties.
 * @param {string} [options.color] The line color.
 * @param {number} [options.width] The line width.
 * @param {string} [options.join] The line join.
 * @param {string} [options.cap] The line cap.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.strokeStyle = function (options)
{
    if (arguments.length > 0)
    {
        if (options.color !== undefined)    this._defaultLineColor     = options.color;
        if (options.width !== undefined)    this._defaultLineWidth     = options.width;
        if (options.join !== undefined)     this._defaultLineJoin      = options.join;
        if (options.cap !== undefined)      this._defaultLineCap       = options.cap;
        if (options.opacity !== undefined)  this._defaultLineOpacity   = options.opacity;
    }
    return this;
};

/** 
 * Draws a shape by stroking its outline.
 * Style precedence works in the following order:
 * default styles specified by strokeStyle() 
 * > styles specified by methods eg strokeColor() 
 * > styles specified in the options param 
 *
 * @since 0.1.0
 * @param {Object} [options] The stroke properties.
 * @param {string} [options.color] The line color.
 * @param {number} [options.width] The line width.
 * @param {string} [options.join] The line join.
 * @param {string} [options.cap] The line cap.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.stroke = function (options)
{
    // Style precedence works in the following order:
    // default styles > method styles > option styles
    if (options !== undefined) 
    {
        if (options.color !== undefined)    this.lineColor(options.color);
        if (options.width !== undefined)    this.lineWidth(options.width);
        if (options.join !== undefined)     this.lineJoin(options.join);
        if (options.cap !== undefined)      this.lineCap(options.cap);
        if (options.opacity !== undefined)  this.lineOpacity(options.opacity);
    }

    // Call subclass stroke routine.
    this.drawStroke();

    // Reset to default stroke styles after stroke() has completed.
    this.lineColor(this._defaultLineColor)
        .lineWidth(this._defaultLineWidth)
        .lineJoin(this._defaultLineJoin)
        .lineCap(this._defaultLineCap)
        .lineOpacity(this._defaultLineOpacity);

    return this;
};

/** 
 * Get or set the fill color.
 *
 * @since 0.1.0

 * @param {string} color The fill color.
 * @return {string|Canvas} The fill color if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.fillColor = function (color)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isColor(color)) throw new Error('Canvas.fillColor(color): color must be a color.');
        //</validation>

        this._fillColor = color;
        return this;
    }
    else return this._fillColor;
};

/** 
 * Get or set the fill opacity.
 *
 * @since 0.1.0

 * @param {string} opacity The fill opacity.
 * @return {number|Canvas} The fill opacity if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.fillOpacity = function (opacity)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(opacity)) throw new Error('Canvas.fillOpacity(opacity): opacity must be a number.');
        //</validation>

        opacity = Math.max(0, opacity);
        opacity = Math.min(1, opacity);

        this._fillOpacity = opacity;
        return this;
    }
    else return this._fillOpacity;
};

/** 
 * Get or set the line color.
 *
 * @since 0.1.0
 * @param {string} color The line color.
 * @return {string|Canvas} The line color if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineColor = function (color)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isColor(color)) throw new Error('Canvas.lineColor(color): color must be a color.');
        //</validation>

        this._lineColor = color;
        return this;
    }
    else return this._lineColor;
};

/** 
 * Get or set the line width.
 *
 * @since 0.1.0
 * @param {number} width The line width.
 * @return {number|Canvas} The line width if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineWidth = function (width)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(width)) throw new Error('Canvas.lineWidth(width): width must be a number.');
        if (width < 0)        throw new Error('Canvas.lineWidth(width): width must be >= 0.');
        //</validation>

        this._lineWidth = width;
        return this;
    }
    else return this._lineWidth;
};

/** 
 * Get or set the line join.
 *
 * @since 0.1.0
 * @param {string} join The line join, one of "bevel", "round", "miter".
 * @return {string|Canvas} The line join if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineJoin = function (join)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (join !== "bevel" && join !== "round" && join !== "miter")
             throw new Error('Canvas.lineJoin(join): join must one of "bevel", "round", "miter"');
        //</validation>
      
        this._lineJoin = join;
        return this;
    }
    else return this._lineJoin;
};

/** 
 * Get or set the line cap.
 *
 * @since 0.1.0
 * @param {string} cap The line cap, one of "butt", "round", "square".
 * @return {string|Canvas} The line cap if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineCap = function (cap)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (cap !== "butt" && cap !== "round" && cap !== "square")
             throw new Error('Canvas.lineCap(cap): cap must one of "butt", "round", "square"');
        //</validation>

        this._lineCap = cap;
        return this;
    }
    else return this._lineCap;
};

/** 
 * Get or set the line opacity.
 *
 * @since 0.1.0
 * @param {string} opacity A value between 0 and 1.
 * @return {number|Canvas} The line opacity if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineOpacity = function (opacity)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(opacity)) throw new Error('Canvas.lineOpacity(opacity): opacity must be a number.');
        //</validation>

        this._lineOpacity = opacity;
        return this;
    }
    else return this._lineOpacity;
};

// Drawing.

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function()
{
    // TODO For svg we dont want to clear - just change attributes of current dom.
    this.clear();
    this.rect(0, 0, 50, 50).fillColor('#00f500').lineWidth(15).fill().stroke();
    this.ellipse(10, 10, 80, 50).fillColor('#f50000').lineWidth(15).fillOpacity(0.7).fill().stroke();
    this.circle(50, 50, 50).fillColor('#0000f5').fill().stroke({width:12});
    this.polygon([50, 0, 100, 0, 100, 50]).fillColor('#0ff0f5').fill().stroke();
};

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.clear = function ()
{
    return this;
};

/** 
 * Provides the fill drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.drawFill = function ()
{
    return this;
};

/** 
 * Provides the stroke drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.drawStroke = function ()
{
    return this;
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the centre of the circle.
 * @param {number} cy The y position of the centre of the circle.
 * @param {number} r The circle radius.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.circle = function (cx, cy, r)
{
    return this;
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.ellipse = function (x, y, w, h)
{
    return this;
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.rect = function (x, y, w, h)
{
    return this;
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.line = function (x1, y1, x2, y2)
{
    return this;
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.polyline = function (arrCoords)
{
    return this;
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.polygon = function (arrCoords)
{
    return this;
};

// TODO Event handlers.
Canvas.prototype.on = function (strEvents, fncHandler)
{
    return this;
};

// Mapping data coords to pixel coords in order to mimic SVG viewBox functionality.

/** 
 * Converts a point from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {Point} dataPoint A point (data units).
 * @return {Point} A point (pixel units).
 */
Canvas.prototype.getPixelPoint = function (dataPoint)
{
    var x = this.getPixelX(dataPoint.x());
    var y = this.getPixelY(dataPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a bounding box (data units) to a rectangle (pixel units).
 * 
 * @since 0.1.0
 * @param {ViewBox} viewBox A bounding box (data units).
 * @return {Rectangle} A rectangle (pixel units).
 */
Canvas.prototype.getPixelRect = function (viewBox)
{
    var x = this.getPixelX(viewBox.xMin());
    var y = this.getPixelY(viewBox.yMax());
    var w = this.getPixelWidth(viewBox.width());
    var h = this.getPixelHeight(viewBox.height());
    return new Rectangle(x, y, w, h);
};

/** 
 * Converts an x coord from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataX An x coord (data units).
 * @return {number} The x coord (pixel units).
 */
Canvas.prototype.getPixelX = function (dataX)
{
    //<validation>
    if (!isNumber(dataX)) throw new Error('HtmlCanvas.getPixelX(dataX): dataX must be a number.');
    //</validation>
    var px = this._viewPort.x() + this.getPixelWidth(dataX - this._viewBox.xMin());
    return px;
};

/** 
 * Converts a y coord from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataY A y coord (data units).
 * @return {number} The y coord (pixel units).
 */
Canvas.prototype.getPixelY = function (dataY)
{
    //<validation>
    if (!isNumber(dataY)) throw new Error('HtmlCanvas.getPixelY(dataY): dataY must be a number.');
    //</validation>
    var py =  this._viewPort.y() + this._viewPort.height() - this.getPixelHeight(dataY - this._viewBox.yMin());
    return py;
};

/** 
 * Converts a width from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataWidth A width (data units).
 * @return {number} The width (pixel units).
 */
Canvas.prototype.getPixelWidth = function (dataWidth)
{
    //<validation>
    if (!isNumber(dataWidth)) throw new Error('HtmlCanvas.getPixelWidth(dataHeight): dataWidth must be a number.');
    if (dataWidth < 0)        throw new Error('HtmlCanvas.getPixelWidth(dataHeight): dataWidth must be >= 0.');
    //</validation>
    if (dataWidth === 0) return 0;
    var pixelDistance  = (dataWidth / this._viewBox.width()) * this._viewPort.width();
    return pixelDistance;
};

/** 
 * Converts a height from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataHeight A height (data units).
 * @return {number} The height (pixel units).
 */
Canvas.prototype.getPixelHeight = function (dataHeight)
{
    //<validation>
    if (!isNumber(dataHeight)) throw new Error('HtmlCanvas.getPixelHeight(dataHeight): dataHeight must be a number.');
    if (dataHeight < 0)        throw new Error('HtmlCanvas.getPixelHeight(dataHeight): dataHeight must be >= 0.');
    //</validation>
    if (dataHeight === 0) return 0;
    var pixelDistance = (dataHeight / this._viewBox.height()) * this._viewPort.height();
    return pixelDistance;
};

/** 
 * Converts a point from pixel units to data units.
 * 
 * @param {Point} pixelPoint A point (pixel units).
 * @return {Point} A point (data units).
 */
Canvas.prototype.getDataPoint = function (pixelPoint)
{
    var x = this.getDataX(pixelPoint.x());
    var y = this.getDataY(pixelPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a rectangle (pixel units) to a viewBox (data units).
 * 
 * @param {Rectangle} pixelCoords A rectangle (pixel units).
 * @return {ViewBox} A viewBox (data units).
 */
Canvas.prototype.getDataCoords = function (pixelCoords)
{
    var xMin = this.getDataX(pixelCoords.x());
    var yMax = this.getDataY(pixelCoords.y());
    var xMax = xMin + this.getDataWidth(pixelCoords.width());
    var yMin = yMax - this.getPDataHeight(pixelCoords.height());
    return new ViewBox(xMin, yMin, xMax, yMax);
};

/** 
 * Converts an x coord from pixel units to data units.
 * 
 * @param {number} pixelX An x coord (pixel units).
 * @return {number} An x coord (data units).
 */
Canvas.prototype.getDataX = function (pixelX)
{
    //<validation>
    if (!isNumber(pixelX)) throw new Error('Canvas.getDataX(pixelX): pixelX must be a number.');
    //</validation>
    var dataX = this._viewBox.xMin() + this.getDataWidth(pixelX);
    return dataX;
};

/** 
 * Converts a y coord from pixel units to data units.
 * 
 * @param {number} pixelY A y coord (pixel units).
 * @return {number} A y coord (data units).
 */
Canvas.prototype.getDataY = function (pixelY)
{
    //<validation>
    if (!isNumber(pixelY)) throw new Error('Canvas.getDataY(pixelY): pixelY must be a number.');
    //</validation>
    var dataY = this._viewBox.yMin() + this.getDataHeight(this._viewPort.height() - pixelY);
    return dataY;
};

/** 
 * Converts a width from pixel units to data units.
 * 
 * @param {number} pixelWidth A width (pixel units).
 * @return {number} A width (data units).
 */
Canvas.prototype.getDataWidth = function (pixelWidth)
{
    //<validation>
    if (!isNumber(pixelWidth)) throw new Error('Canvas.getDataWidth(pixelWidth): pixelWidth must be a number.');
    if (pixelWidth < 0)        throw new Error('Canvas.getDataWidth(pixelWidth): pixelWidth must be >= 0.');
    //</validation>
    if (pixelWidth === 0) return 0;
    var dataDistance = (pixelWidth / this._viewPort.width()) * this._viewBox.width();
    return dataDistance;
};

/** 
 * Converts a height from pixel units to data units.
 * 
 * @param {number} pixelHeight A height (pixel units).
 * @return {number} A height (data units).
 */
Canvas.prototype.getDataHeight = function (pixelHeight)
{
    //<validation>
    if (!isNumber(pixelHeight)) throw new Error('Canvas.getDataHeight(pixelHeight): pixelHeight must be a number.');
    if (pixelHeight < 0)        throw new Error('Canvas.getDataHeight(pixelHeight): pixelHeight must be >= 0.');
    //</validation>
    if (pixelHeight === 0) return 0;
    var dataDistance = (pixelHeight / this._viewPort.height()) * this._viewBox.height();
    return dataDistance;
};

/** 
 * Adjusts a bounding box to fit a rectangle in order to maintain the aspect ratio.
 *
 * @private
 * @param {ViewBox} viewBox The bounding box.
 * @param {Rectangle} rect The rectangle.
 */
Canvas.prototype.fitViewBoxToViewPort = function (viewBox, rect)
{
    var sy = viewBox.height() / rect.height();
    var sx = viewBox.height() / rect.width();

    var sBBoxX, sBBoxY, sBBoxW, sBBoxH; 

    if (sy > sx)
    {
        sBBoxY = viewBox.yMin();
        sBBoxH = viewBox.height();
        sBBoxW = (rect.width() / rect.height()) * sBBoxH;
        sBBoxX = viewBox.xMin() - ((sBBoxW - viewBox.width()) / 2);
    }
    else if (sx > sy)
    {
        sBBoxX = viewBox.xMin();
        sBBoxW = viewBox.width();
        sBBoxH = (rect.height() / rect.width()) * sBBoxW;
        sBBoxY = viewBox.yMin() - ((sBBoxH - viewBox.height()) / 2);
    }
    else
    {
        sBBoxX = viewBox.xMin();
        sBBoxY = viewBox.yMin();
        sBBoxW = viewBox.width();
        sBBoxH = viewBox.height();
    }

    viewBox.xMin(sBBoxX).yMin(sBBoxY).width(sBBoxW).height(sBBoxH);
};

module.exports = Canvas;
},{"../geom/Point":5,"../geom/Rectangle":6,"../geom/ViewBox":7,"../util":10}],2:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link HtmlCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/SvgCanvas 
 * @requires canvas/Canvas
 * @requires util
 */

// Required modules.
var Canvas      = require('./Canvas');
var util        = require('../util');
var extendClass = util.extendClass;

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias HtmlCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function HtmlCanvas (options)
{
    HtmlCanvas.baseConstructor.call(this, options);
}
extendClass(Canvas, HtmlCanvas);

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.init = function()
{
    // Public instance members.
    this.canvas = document.createElement('canvas'); // The drawing canvas.

    // Private instance members.
    this._ctx   = this.canvas.getContext('2d');     // The drawing context.
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.clear = function ()
{
    this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawFill = function ()
{
    // TODO opacity
    this._ctx.fillStyle      = this.fillColor();
    this._ctx.fill();
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawStroke = function (options)
{
    // TODO Opacity
    this._ctx.strokeStyle    = this.lineColor();
    this._ctx.lineWidth      = this.lineWidth();
    this._ctx.lineJoin       = this.lineJoin();
    this._ctx.lineCap        = this.lineCap();
    this._ctx.stroke();
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.circle = function (cx, cy, r)
{
    this._ctx.beginPath();
    this._ctx.arc(this.getPixelX(cx), this.getPixelY(cy), r, 0, 2 * Math.PI, false);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.ellipse = function (x, y, w, h)
{
    w = this.getPixelWidth(w);
    h = this.getPixelHeight(h);
    x = this.getPixelX(x);
    y = this.getPixelY(y) - h;

    var kappa = 0.5522848,
    ox = (w / 2) * kappa, // control point offset horizontal.
    oy = (h / 2) * kappa, // control point offset vertical.
    xe = x + w,           // x-end.
    ye = y + h,           // y-end.
    xm = x + w / 2,       // x-middle.
    ym = y + h / 2;       // y-middle.

    this._ctx.beginPath();
    this._ctx.moveTo(x, ym);
    this._ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this._ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this._ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this._ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.rect = function (x, y, w, h)
{
    w = this.getPixelWidth(w);
    h = this.getPixelHeight(h);
    x = this.getPixelX(x);
    y = this.getPixelY(y) - h;

    this._ctx.beginPath();
    this._ctx.rect(x, y, w, h);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.line = function (x1, y1, x2, y2)
{
    this._ctx.beginPath();
    this._ctx.moveTo(this.getPixelX(x1), this.getPixelY(y1));
    this._ctx.lineTo(this.getPixelX(x2), this.getPixelY(y2));
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.polyline = function (arrCoords)
{
    this._ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i+=2)
    {
        var x = this.getPixelX(arrCoords[i]);
        var y = this.getPixelY(arrCoords[i+1]);
        if (i === 0)    this._ctx.moveTo(x, y);
        else            this._ctx.lineTo(x, y);
    }
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.polygon = function (arrCoords)
{
    this.polyline(arrCoords);
    this._ctx.closePath();
    return this;
};

module.exports = HtmlCanvas;
},{"../util":10,"./Canvas":1}],3:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/SvgCanvas 
 * @requires canvas/Canvas
 * @requires util
 */

// Required modules.
var Canvas      = require('./Canvas');
var util        = require('../util');
var extendClass = util.extendClass;

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias SvgCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function SvgCanvas (options)
{
    SvgCanvas.baseConstructor.call(this, options);
}
extendClass(Canvas, SvgCanvas);

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.init = function()
{
    // Private instance members.
    this._svgNS         = 'http://www.w3.org/2000/svg'; // Namespace for SVG elements.
    this._svgElement    = null;                         // The svg element that is part of the current drawing routine.

    // Public instance members.
    this.canvas         = this.createElement('svg');    // The main svg element.
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.clear = function ()
{
    while (this.canvas.firstChild) 
    {
        this.canvas.removeChild(this.canvas.firstChild);
    }
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawFill = function ()
{
    this.attr(this._svgElement, 
    {
        'fill'            : this.fillColor(),
        'fill-opacity'    : this.fillOpacity()
    });
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawStroke = function ()
{
    this.attr(this._svgElement, 
    {
        'stroke'            : this.lineColor(),
        'stroke-width'      : this.lineWidth(),
        'stroke-linejoin'   : this.lineJoin(),
        'stroke-linecap'    : this.lineCap(),
        'stroke-opacity'    : this.lineOpacity()
    });
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.circle = function (cx, cy, r)
{
    var svgCircle = this.createElement('circle',       
    {
        'cx'    : this.getPixelX(cx),
        'cy'    : this.getPixelY(cy),
        'r'     : r
    });

    this.canvas.appendChild(svgCircle);
    this._svgElement = svgCircle;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.ellipse = function (x, y, w, h)
{
    w = this.getPixelWidth(w);
    h = this.getPixelHeight(h);
    x = this.getPixelX(x);
    y = this.getPixelY(y) - h;

    var rx = w / 2;
    var ry = h / 2;
    var cx = x + rx;
    var cy = y + ry;

    var svgEllipse = this.createElement('ellipse',       
    {
        'cx'    : cx,
        'cy'    : cy,
        'rx'    : rx,
        'ry'    : ry
    });

    this.canvas.appendChild(svgEllipse);
    this._svgElement = svgEllipse;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.rect = function (x, y, w, h)
{
    w = this.getPixelWidth(w);
    h = this.getPixelHeight(h);
    x = this.getPixelX(x);
    y = this.getPixelY(y) - h;

    var svgRect = this.createElement('rect',       
    {
        'x'         : x,
        'y'         : y,
        'width'     : w,
        'height'    : h
    });

    this.canvas.appendChild(svgRect);
    this._svgElement = svgRect;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.line = function (x1, y1, x2, y2)
{
    var svgLine = this.createElement('line',       
    {
        'x1' : this.getPixelX(x1),
        'y1' : this.getPixelY(y1),
        'x2' : this.getPixelX(x2),
        'y2' : this.getPixelY(y2)
    });

    this.canvas.appendChild(svgLine);
    this._svgElement = svgLine;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polyline = function (arrCoords)
{
    var svgPolyline = this.createElement('polyline',       
    {
        'points' : this.getPointsAsString(arrCoords)
    });

    this.canvas.appendChild(svgPolyline);
    this._svgElement = svgPolyline;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polygon = function (arrCoords)
{
    var svgPolygon = this.createElement('polygon',       
    {
        'points' : this.getPointsAsString(arrCoords)
    });

    this.canvas.appendChild(svgPolygon);
    this._svgElement = svgPolygon;

    return this;
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @param {number[]} arrCoords The list of coords.
 * @return {string} A string containing the list of coords.
 */
SvgCanvas.prototype.getPointsAsString = function (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n; i+=2)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + this.getPixelX(arrCoords[i]) + ' ' + this.getPixelY(arrCoords[i+1]);
    }
    return strPoints;
};

/** 
 * Creates an element with the given attributes.
 * 
 * @since 0.1.0
 * @param {string} type The element type.
 * @return {attr} attr The list of attributes.
 */
SvgCanvas.prototype.createElement = function (type, attr)
{
    var svgElement = document.createElementNS(this._svgNS, type);
    this.attr(svgElement, attr);
    return svgElement;
};

/** 
 * Sets the attributes for the given svg element.
 * 
 * @since 0.1.0
 * @param {SVGElement} svgElement The svg element.
 * @return {attr} attr The list of attributes.
 */
SvgCanvas.prototype.attr = function (svgElement, attr)
{
    for (var property in attr) 
    {
        if (attr.hasOwnProperty(property))  
        {
            svgElement.setAttribute(property, attr[property]);
        }
    }
};

module.exports = SvgCanvas;
},{"../util":10,"./Canvas":1}],4:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

/**
 * Canvas utility module.
 * @module canvas/util
 */
module.exports = 
{
	/** 
	 * Check if canvas is supported.
	 * @function isSupported
	 */
	isSupported : function ()
	{
        return !!document.createElement('canvas').getContext;
	}
};
},{}],5:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Point} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/Point 
 * @requires util
 */

// Required modules.
var util        = require('../util');
var isNumber    = util.isNumber;

/** 
 * @classdesc A Point defined by its <code>x</code> and <code>y</code> 
 * 
 * @class
 * @alias Point
 * @since 0.1.0
 * @constructor
 *
 *
 * @param {number} [x = 0] The x coord.
 * @param {number} [y = 0] The y coord.
 */
function Point (x, y)
{
    // Private instance members.
    this._x = null; // The x coord.
    this._y = null; // The y coord.

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    this.setCoords(x, y);
}

/** 
 * Set the coordinates.
 *
 * @since 0.1.0
 * @param {number} [x] The x coord.
 * @param {number} [y] The y coord.
 * @return {Point} <code>this</code>.
 */
Point.prototype.setCoords = function (x, y)
{
    if (arguments.length > 0)
    {
        if (x !== undefined) this.x(x);
        if (y !== undefined) this.y(y);
    }
    return this;
};

/** 
 * Get or set the x coord of the left edge.
 *
 * @since 0.1.0
 * @param {number} [coord] The coordinate.
 * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Point.prototype.x = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(coord)) throw new Error('Point.x(coord): coord must be a number.');
        //</validation>
        this._x = coord;
        return this;
    }
    else return this._x;
};

/** 
 * Get or set the y coord of the top edge.
 *
 * @since 0.1.0
 * @param {number} [coord] The coordinate.
 * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Point.prototype.y = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(coord)) throw new Error('Point.y(coord): coord must be a number.');
        //</validation>
        this._y = coord;
        return this;
    }
    else return this._y;
};

/** 
 * Returns a clone of this Point.        
 * 
 * @since 0.1.0
 * @return {Point} The Point.   
 */
Point.prototype.clone = function ()
{
    return new Point(this._x, this._y);
};

module.exports = Point;
},{"../util":10}],6:[function(require,module,exports){
/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Rectangle} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/Rectangle 
 * @requires util
 */

// Required modules.
var util        = require('../util');
var isNumber    = util.isNumber;

/** 
 * @classdesc A rectangle defined by its <code>x</code>, <code>y</code> 
 * <code>width</code> and <code>height</code>.
 * 
 * @class
 * @alias Rectangle
 * @since 0.1.0
 * @constructor
 *
 *
 * @param {number} [x = 0] The x coord of the top left corner.
 * @param {number} [y = 0] The y coord of the top left corner.
 * @param {number} [width = 100] The width.
 * @param {number} [height = 100] The height.
 */
function Rectangle (x, y, width, height)
{
    // Private instance members.
    this._x = null; // The x coord of the top left corner.
    this._y = null; // The y coord of the top left corner.
    this._w = null; // The width.
    this._h = null; // The height.

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    width = width !== undefined ? width : 100;
    height = height !== undefined ? height : 100;
    this.setDimensions(x, y, width, height);
}

/** 
 * Set the dimensions.
 *
 * @since 0.1.0
 * @param {number} [x] The x coord of the top left corner.
 * @param {number} [y] The y coord of the top left corner.
 * @param {number} [w] The width.
 * @param {number} [h] The height.
 * @return {Rectangle} <code>this</code>.
 */
Rectangle.prototype.setDimensions = function (x, y, w, h)
{
    if (arguments.length > 0)
    {
        if (x !== undefined) this.x(x);
        if (y !== undefined) this.y(y);
        if (w !== undefined) this.width(w);
        if (h !== undefined) this.height(h);
    }
    return this;
};

/** 
 * Get or set the x coord of the top left corner.
 *
 * @since 0.1.0
 * @param {number} [coord] The coordinate.
 * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.x = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(coord)) throw new Error('Rectangle.x(coord): coord must be a number.');
        //</validation>
        this._x = coord;
        return this;
    }
    else return this._x;
};

/** 
 * Get or set the y coord of the top left corner.
 *
 * @since 0.1.0
 * @param {number} [coord] The coordinate.
 * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.y = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(coord)) throw new Error('Rectangle.y(coord): coord must be a number.');
        //</validation>
        this._y = coord;
        return this;
    }
    else return this._y;
};

/** 
 * Get or set the width.
 *
 * @since 0.1.0
 * @param {number} [w] The width.
 * @return {number|Rectangle} The width if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.width = function (w)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(w)) throw new Error('Rectangle.width(w): w must be a number.');
        if (w < 0)        throw new Error('Rectangle.width(w): w must be >= 0.');
        //</validation>
        this._w = w;
        return this;
    }
    else return this._w;
};

/** 
 * Get or set the height.
 *
 * @since 0.1.0
 * @param {number} [h] The height.
 * @return {number|Rectangle} The height if no arguments are supplied, otherwise <code>this</code>.
 */
Rectangle.prototype.height = function (h)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(h)) throw new Error('Rectangle.height(h): h must be a number.');
        if (h < 0)        throw new Error('Rectangle.height(h): h must be >= 0.');
        //</validation>
        this._h = h;
        return this;
    }
    else return this._h;
};

/** 
 * Returns a clone of this rectangle.        
 * 
 * @since 0.1.0
 * @return {Rectangle} The rectangle.   
 */
Rectangle.prototype.clone = function ()
{
    return new Rectangle(this._x, this._y, this._w, this._h);
};

module.exports = Rectangle;
},{"../util":10}],7:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Exports the {@link ViewBox} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/ViewBox 
 * @requires util
 */

// Required modules.
var util        = require('../util');
var isNumber    = util.isNumber;

/** 
 * @classdesc An area defined by its position, as indicated 
 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
 * and top-right corner point (<code>xMax</code>, <code>yMax</code>).
 * 
 * @class
 * @alias ViewBox
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [xMin = 0] The x coord of the bottom left corner.
 * @param {number} [yMin = 0] The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 */
function ViewBox (xMin, yMin, xMax, yMax)
{
    // Private instance members.
    this._xMin      = null; // The x coord of the bottom left corner.
    this._xMax      = null; // The x coord of the top right corner.
    this._xCenter   = null; // The x coord of the center.
    this._width     = null; // The width.
    this._yMin      = null; // The y coord of the bottom left corner.
    this._yMax      = null; // The y coord of the top right corner.
    this._yCenter   = null; // The y coord of the center.
    this._height    = null; // The height.

    xMin = xMin !== undefined ? xMin : 0;
    yMin = yMin !== undefined ? yMin : 0;
    xMax = xMax !== undefined ? xMax : 100;
    yMax = yMax !== undefined ? yMax : 100;
    this.setCoords(xMin, yMin, xMax, yMax);
}

/** 
 * Set the dimensions.
 *
 * @since 0.1.0
 * @param {number} [xMin] The x coord of the bottom left corner.
 * @param {number} [yMin] The y coord of the bottom left corner.
 * @param {number} [xMax] The x coord of the top right corner.
 * @param {number} [yMax] The y coord of the top right corner.
 * @return {ViewBox} <code>this</code>.
 */
ViewBox.prototype.setCoords = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        if (xMin !== undefined) this.xMin(xMin);
        if (yMin !== undefined) this.yMin(yMin);
        if (xMax !== undefined) this.xMax(xMax);
        if (yMax !== undefined) this.yMax(yMax);
    }
    return this;
};

/** 
 * Get or set the x coord of the bottom left corner.
 *
 * @since 0.1.0
 * @param {number} [x] The coordinate.
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xMin = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(x)) throw new Error('ViewBox.xMin(x): x must be a number.');
        //</validation>
        this._xMin = x;
        this._width = Math.abs(this._xMax - this._xMin);
        this._xCenter = this._xMin + (this._width / 2); 
        return this;
    }
    else return this._xMin;
};

/** 
 * Get or set the x coord of the top right corner.
 *
 * @since 0.1.0
 * @param {number} [x] The coordinate.
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xMax = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(x)) throw new Error('ViewBox.xMax(x): x must be a number.');
        //</validation>
        this._xMax = x;
        this._width = Math.abs(this._xMax - this._xMin);
        this._xCenter = this._xMin + (this._width / 2);
        return this;
    }
    else return this._xMax;
};


/** 
 * Get or set the x coord of the center.
 *
 * @since 0.1.0
 * @param {number} [x] The coordinate.
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xCenter = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(x)) throw new Error('ViewBox.xCenter(x): x must be a number.');
        //</validation>
        this._xCenter = x;
        this._xMin  = this._xCenter - (this._width / 2);
        this._xMax  = this._xCenter + (this._width / 2);
        return this;
    }
    else return this._xCenter;
};


/** 
 * Get or set the width.
 *
 * @since 0.1.0
 * @param {number} [w] The width.
 * @return {number|ViewBox} The width if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.width = function (w)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(w))  throw new Error('ViewBox.width(w): w must be a number.');
        if (w < 0)         throw new Error('ViewBox.width(w): w must be >= 0.');
        //</validation>
        this._width = w;
        this._xMax = this._xMin + this._width;
        this._xCenter = this._xMin + (this._width / 2);
        return this;
    }
    else return this._width;
};

/** 
 * Get or set the y coord of the bottom left corner.
 *
 * @since 0.1.0
 * @param {number} [y] The coordinate.
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yMin = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(y)) throw new Error('ViewBox.yMin(y): y must be a number.');
        //</validation>
        this._yMin = y;
        this._height = Math.abs(this._yMax - this._yMin);
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._yMin;
};

/** 
 * Get or set the y coord of the top right corner.
 *
 * @since 0.1.0
 * @param {number} [y] The coordinate.
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yMax = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(y)) throw new Error('ViewBox.yMax(y): y must be a number.');
        //</validation>
        this._yMax = y;
        this._height = Math.abs(this._yMax - this._yMin);
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._yMax;
};

/** 
 * Get or set the y coord of the center.
 *
 * @since 0.1.0
 * @param {number} [y] The coordinate.
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yCenter = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(y)) throw new Error('ViewBox.yCenter(y): y must be a number.');
        //</validation>
        this._yCenter = y;
        this._yMin  = this._yCenter - (this._height / 2);
        this._yMax  = this._yCenter + (this._height / 2);
        return this;
    }
    else return this._yCenter;
};

/** 
 * Get or set the height.
 *
 * @since 0.1.0
 * @param {number} [h] The height.
 * @return {number|ViewBox} The height if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.height = function (h)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(h)) throw new Error('ViewBox.height(h): h must be a number.');
        if (h < 0)        throw new Error('ViewBox.height(h): h must be >= 0.');
        //</validation>
        this._height = h;
        this._yMax = this._yMin + this._height;
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._height;
};

/** 
 * Returns a clone of this ViewBox.        
 * 
 * @since 0.1.0
 * @return {ViewBox} The ViewBox.   
 */
ViewBox.prototype.clone = function ()
{
    return new ViewBox(this._xMin, this._yMin, this._xMax, this._yMax);
};

/** 
 * Returns true if a ViewBox equals to this one.
 * 
 * @since 0.1.0
 * @param {ViewBox} vb The ViewBox.
 * @return {boolean} true, if the ViewBox is equal to this one, otherwise false.
 */
ViewBox.prototype.equals = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.equals(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() !== this._xMin) return false;
        if (vb.getYMin() !== this._yMin) return false;
        if (vb.getXMax() !== this._xMax) return false;
        if (vb.getYMax() !== this._yMax) return false;
        return true;
    }
    else throw new Error('ViewBox.equals(vb): vb has not been defined.');
};

/** 
 * Returns true if a ViewBox intersects this one.
 * 
 * @since 0.1.0
 * @param {ViewBox} vb The ViewBox.
 * @return {boolean} true, if the ViewBox intercepts this one, otherwise false.
 */
ViewBox.prototype.intersects = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.intersects(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() > this._xMax) return false;
        if (vb.getXMax() < this._xMin) return false;
        if (vb.getYMin() > this._yMax) return false;
        if (vb.getYMax() < this._yMin) return false;
        return true;
    }
    else throw new Error('ViewBox.intersects(vb): vb has not been defined.');
};

/** 
 * Returns true if a ViewBox is contained within this one.
 * 
 * @since 0.1.0
 * @param {ViewBox} vb The ViewBox.
 * @return {boolean} true, if the ViewBox is contained within this one, otherwise false.
 */
ViewBox.prototype.contains = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.contains(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() < this._xMin) return false;
        if (vb.getXMax() > this._xMax) return false;
        if (vb.getYMin() < this._yMin) return false;
        if (vb.getYMax() > this._yMax) return false;
        return true;
    }
    else throw new Error('ViewBox.contains(vb): vb has not been defined.');
};

module.exports = ViewBox;
},{"../util":10}],8:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

// Grab an existing namespace object, or create a blank object if it doesn't exist.
// Add the modules.
// Only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly.
var flowingcharts = window.flowingcharts || 
{
    util : require('./canvas/util')
};

require('./plugins/jqueryplugin');

// Replace/Create the global namespace
window.flowingcharts = flowingcharts;
},{"./canvas/util":4,"./plugins/jqueryplugin":9}],9:[function(require,module,exports){
(function (global){
/* jshint browserify: true */
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../canvas/HtmlCanvas":2,"../canvas/SvgCanvas":3}],10:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains utility functions.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module util 
 */

module.exports = 
{
    /** 
     * Check if n is a valid number. Returns false if n is equal to NaN, Infinity, -Infinity or a string eg '10'.
     *
     * @param {*} n The number to test.
     * @return {boolean} true, if n is a number, otherwise false.
     */
    isNumber : function (n)
    {
        // (typeof n == 'number')   Reject objects that arent number types eg numbers stored as strings such as '10'.
        //                          NaN, Infinity and -Infinity are number types so will pass this test.
        // isFinite(n)              Reject infinite numbers.
        // !isNaN(n))               Reject NaN.
        return (typeof n == 'number') && isFinite(n) && !isNaN(n);
    },

    /** 
     * Check if c is a valid color.
     *
     * @param {*} c The number to test.
     * @return {boolean} true, if c is a number, otherwise false.
     */
    isColor : function (c)
    {
        // TODO test for rgb colors.
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#ac3');
    },

    /** 
     * Check if c is a valid color.
     *
     * @param {*} c The number to test.
     * @return {boolean} true, if c is a number, otherwise false.
     */
    isHexColor : function (c)
    {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#ac3');
    },

    /** 
     * Extend an object a with the properties of object b.
     *
     * @param {Object} a The object to be extended.
     * @param {Object} b The object to add to the first one.
     */
    extendObject : function (a, b)
    {
        for (var key in b)
        {
            if (b.hasOwnProperty(key)) a[key] = b[key];
        }
        return a;
    },

    /** 
     * A function used to extend one class with another.
     *
     * @param {Object} baseClass The class from which to inherit.
     * @param {Object} subClass The inheriting class, or subclass.
     */
    extendClass : function(baseClass, subClass)
    {
        function Inheritance() {}
        Inheritance.prototype = baseClass.prototype;
        subClass.prototype = new Inheritance();
        subClass.prototype.constructor = subClass;
        subClass.baseConstructor = baseClass;
        subClass.superClass = baseClass.prototype;
    }
};
},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FudmFzL0NhbnZhcy5qcyIsInNyYy9jYW52YXMvSHRtbENhbnZhcy5qcyIsInNyYy9jYW52YXMvU3ZnQ2FudmFzLmpzIiwic3JjL2NhbnZhcy91dGlsLmpzIiwic3JjL2dlb20vUG9pbnQuanMiLCJzcmMvZ2VvbS9SZWN0YW5nbGUuanMiLCJzcmMvZ2VvbS9WaWV3Qm94LmpzIiwic3JjL21haW4uanMiLCJzcmMvcGx1Z2lucy9qcXVlcnlwbHVnaW4uanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNzJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCBicm93c2VyaWZ5OiB0cnVlICovXHJcbi8qIGdsb2JhbHMgREVCVUcgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgRXhwb3J0cyB0aGUge0BsaW5rIENhbnZhc30gY2xhc3MuXHJcbiAqIEBhdXRob3IgSm9uYXRoYW4gQ2xhcmUgXHJcbiAqIEBjb3B5cmlnaHQgRmxvd2luZ0NoYXJ0cyAyMDE1XHJcbiAqIEBtb2R1bGUgY2FudmFzL0NhbnZhcyBcclxuICogQHJlcXVpcmVzIHV0aWxcclxuICogQHJlcXVpcmVzIGdlb20vVmlld0JveFxyXG4gKiBAcmVxdWlyZXMgZ2VvbS9SZWN0YW5nbGVcclxuICogQHJlcXVpcmVzIGdlb20vUG9pbnRcclxuICovXHJcblxyXG4vLyBSZXF1aXJlZCBtb2R1bGVzLlxyXG52YXIgVmlld0JveCAgICAgPSByZXF1aXJlKCcuLi9nZW9tL1ZpZXdCb3gnKTtcclxudmFyIFJlY3RhbmdsZSAgID0gcmVxdWlyZSgnLi4vZ2VvbS9SZWN0YW5nbGUnKTtcclxudmFyIFBvaW50ICAgICAgID0gcmVxdWlyZSgnLi4vZ2VvbS9Qb2ludCcpO1xyXG52YXIgdXRpbCAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsJyk7XHJcbnZhciBpc0NvbG9yICAgICA9IHV0aWwuaXNDb2xvcjtcclxudmFyIGlzTnVtYmVyICAgID0gdXRpbC5pc051bWJlcjtcclxuXHJcbi8qKiBcclxuICogQGNsYXNzZGVzYyBBIGJhc2Ugd3JhcHBlciBjbGFzcyBmb3IgZ3JhcGhpY3MgbGlicmFyaWVzLlxyXG4gKlxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIENhbnZhc1xyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtvcHRpb25zLmNvbnRhaW5lcl0gVGhlIGh0bWwgZWxlbWVudCB0aGF0IHdpbGwgY29udGFpbiB0aGUgcmVuZGVyZXIuIFxyXG4gKi9cclxuZnVuY3Rpb24gQ2FudmFzIChvcHRpb25zKVxyXG57XHJcbiAgICAvLyBQcml2YXRlIGluc3RhbmNlIG1lbWJlcnMuICAgIFxyXG4gICAgdGhpcy5fdmlld1BvcnQgICAgICA9IG5ldyBSZWN0YW5nbGUoKTsgIC8vIFRoZSByZWN0YW5nbGUgZGVmaW5pbmcgdGhlIHBpeGVsIGNvb3Jkcy5cclxuICAgIHRoaXMuX3ZpZXdCb3ggICAgICAgPSBuZXcgVmlld0JveCgpOyAgICAvLyBUaGUgdmlld0JveCBkZWZpbmluZyB0aGUgZGF0YSBjb29yZHMuXHJcbiAgICB0aGlzLl9pc1ZpZXdCb3hTZXQgID0gZmFsc2U7ICAgICAgICAgICAgLy8gSW5kaWNhdGVzIGlmIHRoZSB2aWV3Qm94IGhhcyBiZWVuIHNldC5cclxuXHJcbiAgICAvLyBEZWZhdWx0IHN0eWxlcy5cclxuICAgIHRoaXMuX2RlZmF1bHRGaWxsQ29sb3IgICAgICAgPSAnI2ZmZmZmZic7IFxyXG4gICAgdGhpcy5fZGVmYXVsdEZpbGxPcGFjaXR5ICAgICA9IDE7XHJcbiAgICB0aGlzLl9kZWZhdWx0TGluZUNvbG9yICAgICAgID0gJyMwMDAwMDAnOyBcclxuICAgIHRoaXMuX2RlZmF1bHRMaW5lV2lkdGggICAgICAgPSAxOyBcclxuICAgIHRoaXMuX2RlZmF1bHRMaW5lSm9pbiAgICAgICAgPSAncm91bmQnO1xyXG4gICAgdGhpcy5fZGVmYXVsdExpbmVDYXAgICAgICAgICA9ICdidXR0JztcclxuICAgIHRoaXMuX2RlZmF1bHRMaW5lT3BhY2l0eSAgICAgPSAxO1xyXG5cclxuICAgIC8vIEN1cnJlbnQgc3R5bGVzIG92ZXJyaWRlIGRlZmF1bHQgc3R5bGVzLlxyXG4gICAgdGhpcy5fZmlsbENvbG9yICAgICAgICAgICAgID0gJyNmZmZmZmYnOyBcclxuICAgIHRoaXMuX2ZpbGxPcGFjaXR5ICAgICAgICAgICA9IDE7XHJcbiAgICB0aGlzLl9saW5lQ29sb3IgICAgICAgICAgICAgPSAnIzAwMDAwMCc7ICBcclxuICAgIHRoaXMuX2xpbmVXaWR0aCAgICAgICAgICAgICA9IDE7IFxyXG4gICAgdGhpcy5fbGluZUpvaW4gICAgICAgICAgICAgID0gJ3JvdW5kJzsgXHJcbiAgICB0aGlzLl9saW5lQ2FwICAgICAgICAgICAgICAgPSAnYnV0dCc7IFxyXG4gICAgdGhpcy5fbGluZU9wYWNpdHkgICAgICAgICAgID0gMTsgXHJcblxyXG4gICAgLy8gUHVibGljIGluc3RhbmNlIG1lbWJlcnMuICBcclxuXHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIGFjdHVhbCBkcmF3aW5nIGNhbnZhcy5cclxuICAgICAqIFxyXG4gICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAgKiBAdHlwZSBIVE1MRWxlbWVudFxyXG4gICAgICogQGRlZmF1bHQgbnVsbFxyXG4gICAgICovXHJcbiAgICB0aGlzLmNhbnZhcyA9IG51bGw7XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogSWYgc2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IHRoZSB2aWV3Qm94IGlzIGFkanVzdGVkIHRvIG1haW50YWluIHRoZSBhc3BlY3QgcmF0aW8uXHJcbiAgICAgKiBJZiBzZXQgdG8gPGNvZGU+ZmFsc2U8L2NvZGU+IHRoZSB2aWV3Qm94IHN0cmV0Y2hlcyB0byBmaWxsIHRoZSB2aWV3UG9ydC5cclxuICAgICAqIFxyXG4gICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAgKiBAdHlwZSBib29sZWFuXHJcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxyXG4gICAgICovXHJcbiAgICB0aGlzLnByZXNlcnZlQXNwZWN0UmF0aW8gPSBmYWxzZTtcclxuXHJcbiAgICAvLyBUT0RPIERvIHdlIG5lZWQgdG8gYWRkIHNvbWV0aGluZyBoZXJlIHRvIGhhbmRsZSBubyBjb250YWluZXI/XHJcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucyA6IHt9O1xyXG5cclxuICAgIC8vIEluaXRpYWxpc2UuICAgXHJcbiAgICB0aGlzLmluaXQoKTtcclxuXHJcbiAgICAvLyBBcHBlbmQgY2FudmFzIHRvIGNvbnRhaW5lciBhbmQgc2V0IGl0cyBpbml0aWFsIHNpemUuXHJcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5jb250YWluZXIpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gQXBwZW5kIGNhbnZhcyB0byBwYXJlbnQgY29udGFpbmVyLlxyXG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9vcHRpb25zLmNvbnRhaW5lcjtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgICAvLyBSZXNpemUgdGhlIGNhbnZhcyB0byBmaXQgaXRzIGNvbnRhaW5lciBhbmQgZG8gc2FtZSB3aGVuIHRoZSB3aW5kb3cgcmVzaXplcy5cclxuICAgICAgICB0aGlzLnNldFNpemUoY29udGFpbmVyLm9mZnNldFdpZHRoLCBjb250YWluZXIub2Zmc2V0SGVpZ2h0KTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZXNpemVUaW1lb3V0O1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoZXZlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBBZGQgYSByZXNpemVUaW1lb3V0IHRvIHN0b3AgbXVsdGlwbGUgY2FsbHMgdG8gc2V0U2l6ZSgpLlxyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplVGltZW91dCk7XHJcbiAgICAgICAgICAgIHJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpXHJcbiAgICAgICAgICAgIHsgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbWUuc2V0U2l6ZShjb250YWluZXIub2Zmc2V0V2lkdGgsIGNvbnRhaW5lci5vZmZzZXRIZWlnaHQpO1xyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE8gUmVtb3ZlIHRoaXMuXHJcbiAgICB0aGlzLnZpZXdCb3goMCwgMCwgMTAwLCAxMDApO1xyXG5cclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbn1cclxuXHJcbi8qKiBcclxuICogSW5pdGlhbGlzYXRpb24gY29kZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXHJcbntcclxuXHJcbn07XHJcblxyXG4vLyBHZW9tZXRyeS5cclxuXHJcbi8qKiBcclxuICogR2V0IHRoZSB3aWR0aCBvZiB0aGUgY2FudmFzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgd2lkdGguXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLndpZHRoID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuY2FudmFzLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBjYW52YXMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBoZWlnaHQuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmhlaWdodCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIHJldHVybiBwYXJzZUludCh0aGlzLmNhbnZhcy5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogU2V0IHRoZSBzaXplIG9mIHRoZSBjYW52YXMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gdyBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBoIFRoZSBoZWlnaHQuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbiAodywgaClcclxue1xyXG4gICAgLy88dmFsaWRhdGlvbj5cclxuICAgIGlmICghaXNOdW1iZXIodykpIHRocm93IG5ldyBFcnJvcignQ2FudmFzLnNldFNpemUodyk6IHcgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgIGlmICh3IDwgMCkgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzLnNldFNpemUodyk6IHcgbXVzdCBiZSA+PSAwLicpO1xyXG4gICAgaWYgKCFpc051bWJlcihoKSkgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMuc2V0U2l6ZShoKTogaCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgaWYgKGggPCAwKSAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMuc2V0U2l6ZShoKTogaCBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAvLzwvdmFsaWRhdGlvbj5cclxuXHJcbiAgICBpZiAodyAhPT0gdGhpcy53aWR0aCgpIHx8IGggIT09IHRoaXMuaGVpZ2h0KCkpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gQ2FudmFzIHNpemUuXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHcpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaCk7XHJcblxyXG4gICAgICAgIC8vIHZpZXdQb3J0LlxyXG4gICAgICAgIHZhciBsZWZ0TWFyZ2luID0gNDA7XHJcbiAgICAgICAgdmFyIHJpZ2h0TWFyZ2luID0gNDA7XHJcbiAgICAgICAgdmFyIHRvcE1hcmdpbiA9IDQwO1xyXG4gICAgICAgIHZhciBib3R0b21NYXJnaW4gPSA0MDtcclxuICAgICAgICB2YXIgeCA9IGxlZnRNYXJnaW47XHJcbiAgICAgICAgdmFyIHkgPSB0b3BNYXJnaW47XHJcbiAgICAgICAgdmFyIHdpZHRoID0gdyAtIChsZWZ0TWFyZ2luICsgcmlnaHRNYXJnaW4pO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBoIC0gKHRvcE1hcmdpbiArIGJvdHRvbU1hcmdpbik7XHJcbiAgICAgICAgdGhpcy52aWV3UG9ydCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gTWF0Y2ggdGhlIHZpZXdCb3ggdG8gdGhlIHZpZXdQb3J0IGlmIGl0IGhhc250IGJlZW4gc2V0IHVzaW5nIHZpZXdCb3goKS5cclxuICAgICAgICBpZiAodGhpcy5faXNWaWV3Qm94U2V0ID09PSBmYWxzZSkgIHRoaXMuX3ZpZXdCb3guc2V0Q29vcmRzKDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBBIHJlY3RhbmdsZSB0aGF0IGRlZmluZXMgdGhlIGRyYXdpbmcgYXJlYSAoaW4gcGl4ZWxzKSB3aXRoaW4gdGhlIGNhbnZhcy5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt4ID0gMF0gVGhlIHggY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt5ID0gMF0gVGhlIHkgY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aCA9IDEwMF0gVGhlIHdpZHRoLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodCA9IDEwMF0gVGhlIGhlaWdodC5cclxuICogQHJldHVybiB7UmVjdGFuZ2xlfENhbnZhc30gQSBSZWN0YW5nbGUgdGhhdCBkZWZpbmVkcyB0aGUgdmlld1BvcnQgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS52aWV3UG9ydCA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fdmlld1BvcnQuc2V0RGltZW5zaW9ucyh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBpZiAodGhpcy5wcmVzZXJ2ZUFzcGVjdFJhdGlvKSB0aGlzLmZpdFZpZXdCb3hUb1ZpZXdQb3J0KHRoaXMuX3ZpZXdCb3gsIHRoaXMuX3ZpZXdQb3J0KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3ZpZXdQb3J0O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBUaGUgdmFsdWUgb2YgdGhlIHZpZXdCb3ggc3BlY2lmaWVzIGEgcmVjdGFuZ2xlIGluIHVzZXIgc3BhY2Ugd2hpY2ggaXMgbWFwcGVkIHRvIHRoZSBib3VuZHMgb2YgdGhlIGNhbnZhcy4gXHJcbiAqIFRoZSB2aWV3Qm94IGhhcyBpdHMgb3JpZ2luIGF0IHRoZSBib3R0b20gbGVmdCBjb3JuZXIgb2YgdGhlIGNhbnZhcyB3aXRoIHRoZSBcclxuICogcG9zaXRpdmUgeC1heGlzIHBvaW50aW5nIHRvd2FyZHMgdGhlIHJpZ2h0LCB0aGUgcG9zaXRpdmUgeS1heGlzIHBvaW50aW5nIHVwLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hNaW4gPSAwXSBUaGUgeCBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3lNaW4gPSAwXSBUaGUgeSBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hNYXggPSAxMDBdIFRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3lNYXggPSAxMDBdIFRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKiBAcmV0dXJuIHtWaWV3Qm94fENhbnZhc30gVGhlIFZpZXdCb3ggaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS52aWV3Qm94ID0gZnVuY3Rpb24gKHhNaW4sIHlNaW4sIHhNYXgsIHlNYXgpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9pc1ZpZXdCb3hTZXQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdCb3guc2V0Q29vcmRzKHhNaW4sIHlNaW4sIHhNYXgsIHlNYXgpO1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNlcnZlQXNwZWN0UmF0aW8pIHRoaXMuZml0Vmlld0JveFRvVmlld1BvcnQodGhpcy5fdmlld0JveCwgdGhpcy5fdmlld1BvcnQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5fdmlld0JveDtcclxufTtcclxuXHJcbi8vIFN0eWxpbmcuXHJcblxyXG4vKiogXHJcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgc3Ryb2tlIHN0eWxlLiBUaGlzIGNhbiBiZSBvdmVycmlkZGVuIG9uIGEgc2hhcGUgYnkgXHJcbiAqIHNoYXBlIGJhc2lzIGJ5IGNhbGxpbmcgW2ZpbGxDb2xvcigpXXtAbGluayBDYW52YXMjZmlsbENvbG9yfSBvciBbZmlsbE9wYWNpdHkoKV17QGxpbmsgQ2FudmFzI2ZpbGxPcGFjaXR5fS4gIFxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgZmlsbCBwcm9wZXJ0aWVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY29sb3JdIFRoZSBmaWxsIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMub3BhY2l0eV0gVGhlIGZpbGwgb3BhY2l0eS5cclxuICogQHJldHVybiB7Q2FudmFzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZmlsbFN0eWxlID0gZnVuY3Rpb24gKG9wdGlvbnMpXHJcbntcclxuICAgIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmNvbG9yICE9PSB1bmRlZmluZWQpICAgIHRoaXMuX2RlZmF1bHRGaWxsQ29sb3IgICAgID0gb3B0aW9ucy5jb2xvcjtcclxuICAgICAgICBpZiAob3B0aW9ucy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpICB0aGlzLl9kZWZhdWx0RmlsbE9wYWNpdHkgICA9IG9wdGlvbnMub3BhY2l0eTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBEcmF3cyBhIHNoYXBlIGJ5IGZpbGxpbmcgaXRzIGNvbnRlbnQgYXJlYS4gXHJcbiAqIFN0eWxlIHByZWNlZGVuY2Ugd29ya3MgaW4gdGhlIGZvbGxvd2luZyBvcmRlcjpcclxuICogPiBkZWZhdWx0IHN0eWxlcyBzcGVjaWZpZWQgYnkgZmlsbFN0eWxlKCkgXHJcbiAqID4gc3R5bGVzIHNwZWNpZmllZCBieSBtZXRob2RzIGVnIGZpbGxDb2xvcigpIFxyXG4gKiA+IHN0eWxlcyBzcGVjaWZpZWQgaW4gdGhlIG9wdGlvbnMgcGFyYW0gXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBmaWxsIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jb2xvcl0gVGhlIGZpbGwgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5vcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LlxyXG4gKiBAcmV0dXJuIHtDYW52YXN9IDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKG9wdGlvbnMpXHJcbntcclxuICAgIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmNvbG9yICE9PSB1bmRlZmluZWQpICAgIHRoaXMuZmlsbENvbG9yKG9wdGlvbnMuY29sb3IpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLm9wYWNpdHkgIT09IHVuZGVmaW5lZCkgIHRoaXMuZmlsbE9wYWNpdHkob3B0aW9ucy5vcGFjaXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsIHN1YmNsYXNzIGZpbGwgcm91dGluZS5cclxuICAgIHRoaXMuZHJhd0ZpbGwoKTtcclxuXHJcbiAgICAvLyBSZXNldCB0byBkZWZhdWx0IHN0cm9rZSBzdHlsZXMgYWZ0ZXIgZmlsbCgpIGhhcyBjb21wbGV0ZWQuXHJcbiAgICB0aGlzLmZpbGxDb2xvcih0aGlzLl9kZWZhdWx0RmlsbENvbG9yKS5maWxsT3BhY2l0eSh0aGlzLl9kZWZhdWx0RmlsbE9wYWNpdHkpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgZmlsbCBzdHlsZS4gVGhpcyBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBhIHNoYXBlIGJ5IFxyXG4gKiBzaGFwZSBiYXNpcyBieSBjYWxsaW5nIHtAbGluayBsaW5lQ29sb3IoKX0sIHtAbGluayBsaW5lV2lkdGgoKX0sIFxyXG4gKiB7QGxpbmsgbGluZUpvaW4oKX0sIHtAbGluayBsaW5lQ2FwKCl9IG9yIHtAbGluayBsaW5lT3BhY2l0eSgpfS4gIFxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgc3Ryb2tlIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jb2xvcl0gVGhlIGxpbmUgY29sb3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy53aWR0aF0gVGhlIGxpbmUgd2lkdGguXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5qb2luXSBUaGUgbGluZSBqb2luLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY2FwXSBUaGUgbGluZSBjYXAuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5vcGFjaXR5XSBUaGUgZmlsbCBvcGFjaXR5LlxyXG4gKiBAcmV0dXJuIHtDYW52YXN9IDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5zdHJva2VTdHlsZSA9IGZ1bmN0aW9uIChvcHRpb25zKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuY29sb3IgIT09IHVuZGVmaW5lZCkgICAgdGhpcy5fZGVmYXVsdExpbmVDb2xvciAgICAgPSBvcHRpb25zLmNvbG9yO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndpZHRoICE9PSB1bmRlZmluZWQpICAgIHRoaXMuX2RlZmF1bHRMaW5lV2lkdGggICAgID0gb3B0aW9ucy53aWR0aDtcclxuICAgICAgICBpZiAob3B0aW9ucy5qb2luICE9PSB1bmRlZmluZWQpICAgICB0aGlzLl9kZWZhdWx0TGluZUpvaW4gICAgICA9IG9wdGlvbnMuam9pbjtcclxuICAgICAgICBpZiAob3B0aW9ucy5jYXAgIT09IHVuZGVmaW5lZCkgICAgICB0aGlzLl9kZWZhdWx0TGluZUNhcCAgICAgICA9IG9wdGlvbnMuY2FwO1xyXG4gICAgICAgIGlmIChvcHRpb25zLm9wYWNpdHkgIT09IHVuZGVmaW5lZCkgIHRoaXMuX2RlZmF1bHRMaW5lT3BhY2l0eSAgID0gb3B0aW9ucy5vcGFjaXR5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERyYXdzIGEgc2hhcGUgYnkgc3Ryb2tpbmcgaXRzIG91dGxpbmUuXHJcbiAqIFN0eWxlIHByZWNlZGVuY2Ugd29ya3MgaW4gdGhlIGZvbGxvd2luZyBvcmRlcjpcclxuICogZGVmYXVsdCBzdHlsZXMgc3BlY2lmaWVkIGJ5IHN0cm9rZVN0eWxlKCkgXHJcbiAqID4gc3R5bGVzIHNwZWNpZmllZCBieSBtZXRob2RzIGVnIHN0cm9rZUNvbG9yKCkgXHJcbiAqID4gc3R5bGVzIHNwZWNpZmllZCBpbiB0aGUgb3B0aW9ucyBwYXJhbSBcclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIHN0cm9rZSBwcm9wZXJ0aWVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY29sb3JdIFRoZSBsaW5lIGNvbG9yLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMud2lkdGhdIFRoZSBsaW5lIHdpZHRoLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuam9pbl0gVGhlIGxpbmUgam9pbi5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmNhcF0gVGhlIGxpbmUgY2FwLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMub3BhY2l0eV0gVGhlIGZpbGwgb3BhY2l0eS5cclxuICogQHJldHVybiB7Q2FudmFzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuc3Ryb2tlID0gZnVuY3Rpb24gKG9wdGlvbnMpXHJcbntcclxuICAgIC8vIFN0eWxlIHByZWNlZGVuY2Ugd29ya3MgaW4gdGhlIGZvbGxvd2luZyBvcmRlcjpcclxuICAgIC8vIGRlZmF1bHQgc3R5bGVzID4gbWV0aG9kIHN0eWxlcyA+IG9wdGlvbiBzdHlsZXNcclxuICAgIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmNvbG9yICE9PSB1bmRlZmluZWQpICAgIHRoaXMubGluZUNvbG9yKG9wdGlvbnMuY29sb3IpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLndpZHRoICE9PSB1bmRlZmluZWQpICAgIHRoaXMubGluZVdpZHRoKG9wdGlvbnMud2lkdGgpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLmpvaW4gIT09IHVuZGVmaW5lZCkgICAgIHRoaXMubGluZUpvaW4ob3B0aW9ucy5qb2luKTtcclxuICAgICAgICBpZiAob3B0aW9ucy5jYXAgIT09IHVuZGVmaW5lZCkgICAgICB0aGlzLmxpbmVDYXAob3B0aW9ucy5jYXApO1xyXG4gICAgICAgIGlmIChvcHRpb25zLm9wYWNpdHkgIT09IHVuZGVmaW5lZCkgIHRoaXMubGluZU9wYWNpdHkob3B0aW9ucy5vcGFjaXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsIHN1YmNsYXNzIHN0cm9rZSByb3V0aW5lLlxyXG4gICAgdGhpcy5kcmF3U3Ryb2tlKCk7XHJcblxyXG4gICAgLy8gUmVzZXQgdG8gZGVmYXVsdCBzdHJva2Ugc3R5bGVzIGFmdGVyIHN0cm9rZSgpIGhhcyBjb21wbGV0ZWQuXHJcbiAgICB0aGlzLmxpbmVDb2xvcih0aGlzLl9kZWZhdWx0TGluZUNvbG9yKVxyXG4gICAgICAgIC5saW5lV2lkdGgodGhpcy5fZGVmYXVsdExpbmVXaWR0aClcclxuICAgICAgICAubGluZUpvaW4odGhpcy5fZGVmYXVsdExpbmVKb2luKVxyXG4gICAgICAgIC5saW5lQ2FwKHRoaXMuX2RlZmF1bHRMaW5lQ2FwKVxyXG4gICAgICAgIC5saW5lT3BhY2l0eSh0aGlzLl9kZWZhdWx0TGluZU9wYWNpdHkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSBmaWxsIGNvbG9yLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciBUaGUgZmlsbCBjb2xvci5cclxuICogQHJldHVybiB7c3RyaW5nfENhbnZhc30gVGhlIGZpbGwgY29sb3IgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5maWxsQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghaXNDb2xvcihjb2xvcikpIHRocm93IG5ldyBFcnJvcignQ2FudmFzLmZpbGxDb2xvcihjb2xvcik6IGNvbG9yIG11c3QgYmUgYSBjb2xvci4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuXHJcbiAgICAgICAgdGhpcy5fZmlsbENvbG9yID0gY29sb3I7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl9maWxsQ29sb3I7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIGZpbGwgb3BhY2l0eS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gb3BhY2l0eSBUaGUgZmlsbCBvcGFjaXR5LlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Q2FudmFzfSBUaGUgZmlsbCBvcGFjaXR5IGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZmlsbE9wYWNpdHkgPSBmdW5jdGlvbiAob3BhY2l0eSlcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcihvcGFjaXR5KSkgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMuZmlsbE9wYWNpdHkob3BhY2l0eSk6IG9wYWNpdHkgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuXHJcbiAgICAgICAgb3BhY2l0eSA9IE1hdGgubWF4KDAsIG9wYWNpdHkpO1xyXG4gICAgICAgIG9wYWNpdHkgPSBNYXRoLm1pbigxLCBvcGFjaXR5KTtcclxuXHJcbiAgICAgICAgdGhpcy5fZmlsbE9wYWNpdHkgPSBvcGFjaXR5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5fZmlsbE9wYWNpdHk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIGxpbmUgY29sb3IuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgVGhlIGxpbmUgY29sb3IuXHJcbiAqIEByZXR1cm4ge3N0cmluZ3xDYW52YXN9IFRoZSBsaW5lIGNvbG9yIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUubGluZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIWlzQ29sb3IoY29sb3IpKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhcy5saW5lQ29sb3IoY29sb3IpOiBjb2xvciBtdXN0IGJlIGEgY29sb3IuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcblxyXG4gICAgICAgIHRoaXMuX2xpbmVDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5fbGluZUNvbG9yO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSBsaW5lIHdpZHRoLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFRoZSBsaW5lIHdpZHRoLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Q2FudmFzfSBUaGUgbGluZSB3aWR0aCBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmxpbmVXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcih3aWR0aCkpIHRocm93IG5ldyBFcnJvcignQ2FudmFzLmxpbmVXaWR0aCh3aWR0aCk6IHdpZHRoIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgaWYgKHdpZHRoIDwgMCkgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzLmxpbmVXaWR0aCh3aWR0aCk6IHdpZHRoIG11c3QgYmUgPj0gMC4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuXHJcbiAgICAgICAgdGhpcy5fbGluZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl9saW5lV2lkdGg7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIGxpbmUgam9pbi5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBqb2luIFRoZSBsaW5lIGpvaW4sIG9uZSBvZiBcImJldmVsXCIsIFwicm91bmRcIiwgXCJtaXRlclwiLlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd8Q2FudmFzfSBUaGUgbGluZSBqb2luIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUubGluZUpvaW4gPSBmdW5jdGlvbiAoam9pbilcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKGpvaW4gIT09IFwiYmV2ZWxcIiAmJiBqb2luICE9PSBcInJvdW5kXCIgJiYgam9pbiAhPT0gXCJtaXRlclwiKVxyXG4gICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMubGluZUpvaW4oam9pbik6IGpvaW4gbXVzdCBvbmUgb2YgXCJiZXZlbFwiLCBcInJvdW5kXCIsIFwibWl0ZXJcIicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICBcclxuICAgICAgICB0aGlzLl9saW5lSm9pbiA9IGpvaW47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl9saW5lSm9pbjtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgbGluZSBjYXAuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY2FwIFRoZSBsaW5lIGNhcCwgb25lIG9mIFwiYnV0dFwiLCBcInJvdW5kXCIsIFwic3F1YXJlXCIuXHJcbiAqIEByZXR1cm4ge3N0cmluZ3xDYW52YXN9IFRoZSBsaW5lIGNhcCBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmxpbmVDYXAgPSBmdW5jdGlvbiAoY2FwKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoY2FwICE9PSBcImJ1dHRcIiAmJiBjYXAgIT09IFwicm91bmRcIiAmJiBjYXAgIT09IFwic3F1YXJlXCIpXHJcbiAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhcy5saW5lQ2FwKGNhcCk6IGNhcCBtdXN0IG9uZSBvZiBcImJ1dHRcIiwgXCJyb3VuZFwiLCBcInNxdWFyZVwiJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcblxyXG4gICAgICAgIHRoaXMuX2xpbmVDYXAgPSBjYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl9saW5lQ2FwO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSBsaW5lIG9wYWNpdHkuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gb3BhY2l0eSBBIHZhbHVlIGJldHdlZW4gMCBhbmQgMS5cclxuICogQHJldHVybiB7bnVtYmVyfENhbnZhc30gVGhlIGxpbmUgb3BhY2l0eSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmxpbmVPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghaXNOdW1iZXIob3BhY2l0eSkpIHRocm93IG5ldyBFcnJvcignQ2FudmFzLmxpbmVPcGFjaXR5KG9wYWNpdHkpOiBvcGFjaXR5IG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcblxyXG4gICAgICAgIHRoaXMuX2xpbmVPcGFjaXR5ID0gb3BhY2l0eTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX2xpbmVPcGFjaXR5O1xyXG59O1xyXG5cclxuLy8gRHJhd2luZy5cclxuXHJcbi8qKiBcclxuICogUmVuZGVycyB0aGUgZ3JhcGhpY3MuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIC8vIFRPRE8gRm9yIHN2ZyB3ZSBkb250IHdhbnQgdG8gY2xlYXIgLSBqdXN0IGNoYW5nZSBhdHRyaWJ1dGVzIG9mIGN1cnJlbnQgZG9tLlxyXG4gICAgdGhpcy5jbGVhcigpO1xyXG4gICAgdGhpcy5yZWN0KDAsIDAsIDUwLCA1MCkuZmlsbENvbG9yKCcjMDBmNTAwJykubGluZVdpZHRoKDE1KS5maWxsKCkuc3Ryb2tlKCk7XHJcbiAgICB0aGlzLmVsbGlwc2UoMTAsIDEwLCA4MCwgNTApLmZpbGxDb2xvcignI2Y1MDAwMCcpLmxpbmVXaWR0aCgxNSkuZmlsbE9wYWNpdHkoMC43KS5maWxsKCkuc3Ryb2tlKCk7XHJcbiAgICB0aGlzLmNpcmNsZSg1MCwgNTAsIDUwKS5maWxsQ29sb3IoJyMwMDAwZjUnKS5maWxsKCkuc3Ryb2tlKHt3aWR0aDoxMn0pO1xyXG4gICAgdGhpcy5wb2x5Z29uKFs1MCwgMCwgMTAwLCAwLCAxMDAsIDUwXSkuZmlsbENvbG9yKCcjMGZmMGY1JykuZmlsbCgpLnN0cm9rZSgpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDbGVhciB0aGUgY2FudmFzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHJldHVybiB7Q2FudmFzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogUHJvdmlkZXMgdGhlIGZpbGwgZHJhd2luZyByb3V0aW5lIGZvciB0aGUgZ3JhcGhpY3MgbGlicmFyeSBiZWluZyB1c2VkLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHJldHVybiB7Q2FudmFzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZHJhd0ZpbGwgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogUHJvdmlkZXMgdGhlIHN0cm9rZSBkcmF3aW5nIHJvdXRpbmUgZm9yIHRoZSBncmFwaGljcyBsaWJyYXJ5IGJlaW5nIHVzZWQuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcmV0dXJuIHtDYW52YXN9IDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5kcmF3U3Ryb2tlID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIERyYXdzIGEgY2lyY2xlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IGN4IFRoZSB4IHBvc2l0aW9uIG9mIHRoZSBjZW50cmUgb2YgdGhlIGNpcmNsZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IGN5IFRoZSB5IHBvc2l0aW9uIG9mIHRoZSBjZW50cmUgb2YgdGhlIGNpcmNsZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHIgVGhlIGNpcmNsZSByYWRpdXMuXHJcbiAqIEByZXR1cm4ge0NhbnZhc30gPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmNpcmNsZSA9IGZ1bmN0aW9uIChjeCwgY3ksIHIpXHJcbntcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBEcmF3cyBhbiBlbGxpcHNlLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHggcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkgVGhlIHkgY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHcgVGhlIHdpZHRoLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gaCBUaGUgaGVpZ2h0LlxyXG4gKiBAcmV0dXJuIHtDYW52YXN9IDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5lbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpXHJcbntcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBEcmF3cyBhIHJlY3RhbmdsZS5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB4IHBvc2l0aW9uIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5IFRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB3IFRoZSB3aWR0aC5cclxuICogQHBhcmFtIHtudW1iZXJ9IGggVGhlIGhlaWdodC5cclxuICogQHJldHVybiB7Q2FudmFzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUucmVjdCA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogRHJhd3MgYSBsaW5lLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IHgxIFRoZSB4IHBvc2l0aW9uIG9mIHBvaW50IDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSBUaGUgeSBwb3NpdGlvbiBvZiBwb2ludCAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDIgVGhlIHggcG9zaXRpb24gb2YgcG9pbnQgMi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkyIFRoZSB5IHBvc2l0aW9uIG9mIHBvaW50IDIuXHJcbiAqIEByZXR1cm4ge0NhbnZhc30gPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmxpbmUgPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpXHJcbntcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBEcmF3cyBhIHBvbHlsaW5lLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJbXX0gYXJyQ29vcmRzIEFuIGFycmF5IG9mIHh5IHBvc2l0aW9ucyBvZiB0aGUgZm9ybSBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0Li4uXS5cclxuICogQHJldHVybiB7Q2FudmFzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUucG9seWxpbmUgPSBmdW5jdGlvbiAoYXJyQ29vcmRzKVxyXG57XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogRHJhd3MgYSBwb2x5Z29uLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJbXX0gYXJyQ29vcmRzIEFuIGFycmF5IG9mIHh5IHBvc2l0aW9ucyBvZiB0aGUgZm9ybSBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0Li4uXS5cclxuICogQHJldHVybiB7Q2FudmFzfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUucG9seWdvbiA9IGZ1bmN0aW9uIChhcnJDb29yZHMpXHJcbntcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLy8gVE9ETyBFdmVudCBoYW5kbGVycy5cclxuQ2FudmFzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChzdHJFdmVudHMsIGZuY0hhbmRsZXIpXHJcbntcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLy8gTWFwcGluZyBkYXRhIGNvb3JkcyB0byBwaXhlbCBjb29yZHMgaW4gb3JkZXIgdG8gbWltaWMgU1ZHIHZpZXdCb3ggZnVuY3Rpb25hbGl0eS5cclxuXHJcbi8qKiBcclxuICogQ29udmVydHMgYSBwb2ludCBmcm9tIGRhdGEgdW5pdHMgdG8gcGl4ZWwgdW5pdHMuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtQb2ludH0gZGF0YVBvaW50IEEgcG9pbnQgKGRhdGEgdW5pdHMpLlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gQSBwb2ludCAocGl4ZWwgdW5pdHMpLlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5nZXRQaXhlbFBvaW50ID0gZnVuY3Rpb24gKGRhdGFQb2ludClcclxue1xyXG4gICAgdmFyIHggPSB0aGlzLmdldFBpeGVsWChkYXRhUG9pbnQueCgpKTtcclxuICAgIHZhciB5ID0gdGhpcy5nZXRQaXhlbFkoZGF0YVBvaW50LnkoKSk7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIGJvdW5kaW5nIGJveCAoZGF0YSB1bml0cykgdG8gYSByZWN0YW5nbGUgKHBpeGVsIHVuaXRzKS5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge1ZpZXdCb3h9IHZpZXdCb3ggQSBib3VuZGluZyBib3ggKGRhdGEgdW5pdHMpLlxyXG4gKiBAcmV0dXJuIHtSZWN0YW5nbGV9IEEgcmVjdGFuZ2xlIChwaXhlbCB1bml0cykuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmdldFBpeGVsUmVjdCA9IGZ1bmN0aW9uICh2aWV3Qm94KVxyXG57XHJcbiAgICB2YXIgeCA9IHRoaXMuZ2V0UGl4ZWxYKHZpZXdCb3gueE1pbigpKTtcclxuICAgIHZhciB5ID0gdGhpcy5nZXRQaXhlbFkodmlld0JveC55TWF4KCkpO1xyXG4gICAgdmFyIHcgPSB0aGlzLmdldFBpeGVsV2lkdGgodmlld0JveC53aWR0aCgpKTtcclxuICAgIHZhciBoID0gdGhpcy5nZXRQaXhlbEhlaWdodCh2aWV3Qm94LmhlaWdodCgpKTtcclxuICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHgsIHksIHcsIGgpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhbiB4IGNvb3JkIGZyb20gZGF0YSB1bml0cyB0byBwaXhlbCB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0YVggQW4geCBjb29yZCAoZGF0YSB1bml0cykuXHJcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHggY29vcmQgKHBpeGVsIHVuaXRzKS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZ2V0UGl4ZWxYID0gZnVuY3Rpb24gKGRhdGFYKVxyXG57XHJcbiAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgaWYgKCFpc051bWJlcihkYXRhWCkpIHRocm93IG5ldyBFcnJvcignSHRtbENhbnZhcy5nZXRQaXhlbFgoZGF0YVgpOiBkYXRhWCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICB2YXIgcHggPSB0aGlzLl92aWV3UG9ydC54KCkgKyB0aGlzLmdldFBpeGVsV2lkdGgoZGF0YVggLSB0aGlzLl92aWV3Qm94LnhNaW4oKSk7XHJcbiAgICByZXR1cm4gcHg7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGEgeSBjb29yZCBmcm9tIGRhdGEgdW5pdHMgdG8gcGl4ZWwgdW5pdHMuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGFZIEEgeSBjb29yZCAoZGF0YSB1bml0cykuXHJcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHkgY29vcmQgKHBpeGVsIHVuaXRzKS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZ2V0UGl4ZWxZID0gZnVuY3Rpb24gKGRhdGFZKVxyXG57XHJcbiAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgaWYgKCFpc051bWJlcihkYXRhWSkpIHRocm93IG5ldyBFcnJvcignSHRtbENhbnZhcy5nZXRQaXhlbFkoZGF0YVkpOiBkYXRhWSBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICB2YXIgcHkgPSAgdGhpcy5fdmlld1BvcnQueSgpICsgdGhpcy5fdmlld1BvcnQuaGVpZ2h0KCkgLSB0aGlzLmdldFBpeGVsSGVpZ2h0KGRhdGFZIC0gdGhpcy5fdmlld0JveC55TWluKCkpO1xyXG4gICAgcmV0dXJuIHB5O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhIHdpZHRoIGZyb20gZGF0YSB1bml0cyB0byBwaXhlbCB1bml0cy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0YVdpZHRoIEEgd2lkdGggKGRhdGEgdW5pdHMpLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSB3aWR0aCAocGl4ZWwgdW5pdHMpLlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5nZXRQaXhlbFdpZHRoID0gZnVuY3Rpb24gKGRhdGFXaWR0aClcclxue1xyXG4gICAgLy88dmFsaWRhdGlvbj5cclxuICAgIGlmICghaXNOdW1iZXIoZGF0YVdpZHRoKSkgdGhyb3cgbmV3IEVycm9yKCdIdG1sQ2FudmFzLmdldFBpeGVsV2lkdGgoZGF0YUhlaWdodCk6IGRhdGFXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgaWYgKGRhdGFXaWR0aCA8IDApICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0h0bWxDYW52YXMuZ2V0UGl4ZWxXaWR0aChkYXRhSGVpZ2h0KTogZGF0YVdpZHRoIG11c3QgYmUgPj0gMC4nKTtcclxuICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgaWYgKGRhdGFXaWR0aCA9PT0gMCkgcmV0dXJuIDA7XHJcbiAgICB2YXIgcGl4ZWxEaXN0YW5jZSAgPSAoZGF0YVdpZHRoIC8gdGhpcy5fdmlld0JveC53aWR0aCgpKSAqIHRoaXMuX3ZpZXdQb3J0LndpZHRoKCk7XHJcbiAgICByZXR1cm4gcGl4ZWxEaXN0YW5jZTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ29udmVydHMgYSBoZWlnaHQgZnJvbSBkYXRhIHVuaXRzIHRvIHBpeGVsIHVuaXRzLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRhSGVpZ2h0IEEgaGVpZ2h0IChkYXRhIHVuaXRzKS5cclxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgaGVpZ2h0IChwaXhlbCB1bml0cykuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmdldFBpeGVsSGVpZ2h0ID0gZnVuY3Rpb24gKGRhdGFIZWlnaHQpXHJcbntcclxuICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICBpZiAoIWlzTnVtYmVyKGRhdGFIZWlnaHQpKSB0aHJvdyBuZXcgRXJyb3IoJ0h0bWxDYW52YXMuZ2V0UGl4ZWxIZWlnaHQoZGF0YUhlaWdodCk6IGRhdGFIZWlnaHQgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgIGlmIChkYXRhSGVpZ2h0IDwgMCkgICAgICAgIHRocm93IG5ldyBFcnJvcignSHRtbENhbnZhcy5nZXRQaXhlbEhlaWdodChkYXRhSGVpZ2h0KTogZGF0YUhlaWdodCBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgIGlmIChkYXRhSGVpZ2h0ID09PSAwKSByZXR1cm4gMDtcclxuICAgIHZhciBwaXhlbERpc3RhbmNlID0gKGRhdGFIZWlnaHQgLyB0aGlzLl92aWV3Qm94LmhlaWdodCgpKSAqIHRoaXMuX3ZpZXdQb3J0LmhlaWdodCgpO1xyXG4gICAgcmV0dXJuIHBpeGVsRGlzdGFuY2U7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGEgcG9pbnQgZnJvbSBwaXhlbCB1bml0cyB0byBkYXRhIHVuaXRzLlxyXG4gKiBcclxuICogQHBhcmFtIHtQb2ludH0gcGl4ZWxQb2ludCBBIHBvaW50IChwaXhlbCB1bml0cykuXHJcbiAqIEByZXR1cm4ge1BvaW50fSBBIHBvaW50IChkYXRhIHVuaXRzKS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZ2V0RGF0YVBvaW50ID0gZnVuY3Rpb24gKHBpeGVsUG9pbnQpXHJcbntcclxuICAgIHZhciB4ID0gdGhpcy5nZXREYXRhWChwaXhlbFBvaW50LngoKSk7XHJcbiAgICB2YXIgeSA9IHRoaXMuZ2V0RGF0YVkocGl4ZWxQb2ludC55KCkpO1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ29udmVydHMgYSByZWN0YW5nbGUgKHBpeGVsIHVuaXRzKSB0byBhIHZpZXdCb3ggKGRhdGEgdW5pdHMpLlxyXG4gKiBcclxuICogQHBhcmFtIHtSZWN0YW5nbGV9IHBpeGVsQ29vcmRzIEEgcmVjdGFuZ2xlIChwaXhlbCB1bml0cykuXHJcbiAqIEByZXR1cm4ge1ZpZXdCb3h9IEEgdmlld0JveCAoZGF0YSB1bml0cykuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmdldERhdGFDb29yZHMgPSBmdW5jdGlvbiAocGl4ZWxDb29yZHMpXHJcbntcclxuICAgIHZhciB4TWluID0gdGhpcy5nZXREYXRhWChwaXhlbENvb3Jkcy54KCkpO1xyXG4gICAgdmFyIHlNYXggPSB0aGlzLmdldERhdGFZKHBpeGVsQ29vcmRzLnkoKSk7XHJcbiAgICB2YXIgeE1heCA9IHhNaW4gKyB0aGlzLmdldERhdGFXaWR0aChwaXhlbENvb3Jkcy53aWR0aCgpKTtcclxuICAgIHZhciB5TWluID0geU1heCAtIHRoaXMuZ2V0UERhdGFIZWlnaHQocGl4ZWxDb29yZHMuaGVpZ2h0KCkpO1xyXG4gICAgcmV0dXJuIG5ldyBWaWV3Qm94KHhNaW4sIHlNaW4sIHhNYXgsIHlNYXgpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBDb252ZXJ0cyBhbiB4IGNvb3JkIGZyb20gcGl4ZWwgdW5pdHMgdG8gZGF0YSB1bml0cy5cclxuICogXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwaXhlbFggQW4geCBjb29yZCAocGl4ZWwgdW5pdHMpLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IEFuIHggY29vcmQgKGRhdGEgdW5pdHMpLlxyXG4gKi9cclxuQ2FudmFzLnByb3RvdHlwZS5nZXREYXRhWCA9IGZ1bmN0aW9uIChwaXhlbFgpXHJcbntcclxuICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICBpZiAoIWlzTnVtYmVyKHBpeGVsWCkpIHRocm93IG5ldyBFcnJvcignQ2FudmFzLmdldERhdGFYKHBpeGVsWCk6IHBpeGVsWCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICB2YXIgZGF0YVggPSB0aGlzLl92aWV3Qm94LnhNaW4oKSArIHRoaXMuZ2V0RGF0YVdpZHRoKHBpeGVsWCk7XHJcbiAgICByZXR1cm4gZGF0YVg7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGEgeSBjb29yZCBmcm9tIHBpeGVsIHVuaXRzIHRvIGRhdGEgdW5pdHMuXHJcbiAqIFxyXG4gKiBAcGFyYW0ge251bWJlcn0gcGl4ZWxZIEEgeSBjb29yZCAocGl4ZWwgdW5pdHMpLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IEEgeSBjb29yZCAoZGF0YSB1bml0cykuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmdldERhdGFZID0gZnVuY3Rpb24gKHBpeGVsWSlcclxue1xyXG4gICAgLy88dmFsaWRhdGlvbj5cclxuICAgIGlmICghaXNOdW1iZXIocGl4ZWxZKSkgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMuZ2V0RGF0YVkocGl4ZWxZKTogcGl4ZWxZIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgIHZhciBkYXRhWSA9IHRoaXMuX3ZpZXdCb3gueU1pbigpICsgdGhpcy5nZXREYXRhSGVpZ2h0KHRoaXMuX3ZpZXdQb3J0LmhlaWdodCgpIC0gcGl4ZWxZKTtcclxuICAgIHJldHVybiBkYXRhWTtcclxufTtcclxuXHJcbi8qKiBcclxuICogQ29udmVydHMgYSB3aWR0aCBmcm9tIHBpeGVsIHVuaXRzIHRvIGRhdGEgdW5pdHMuXHJcbiAqIFxyXG4gKiBAcGFyYW0ge251bWJlcn0gcGl4ZWxXaWR0aCBBIHdpZHRoIChwaXhlbCB1bml0cykuXHJcbiAqIEByZXR1cm4ge251bWJlcn0gQSB3aWR0aCAoZGF0YSB1bml0cykuXHJcbiAqL1xyXG5DYW52YXMucHJvdG90eXBlLmdldERhdGFXaWR0aCA9IGZ1bmN0aW9uIChwaXhlbFdpZHRoKVxyXG57XHJcbiAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgaWYgKCFpc051bWJlcihwaXhlbFdpZHRoKSkgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMuZ2V0RGF0YVdpZHRoKHBpeGVsV2lkdGgpOiBwaXhlbFdpZHRoIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICBpZiAocGl4ZWxXaWR0aCA8IDApICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhcy5nZXREYXRhV2lkdGgocGl4ZWxXaWR0aCk6IHBpeGVsV2lkdGggbXVzdCBiZSA+PSAwLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICBpZiAocGl4ZWxXaWR0aCA9PT0gMCkgcmV0dXJuIDA7XHJcbiAgICB2YXIgZGF0YURpc3RhbmNlID0gKHBpeGVsV2lkdGggLyB0aGlzLl92aWV3UG9ydC53aWR0aCgpKSAqIHRoaXMuX3ZpZXdCb3gud2lkdGgoKTtcclxuICAgIHJldHVybiBkYXRhRGlzdGFuY2U7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGEgaGVpZ2h0IGZyb20gcGl4ZWwgdW5pdHMgdG8gZGF0YSB1bml0cy5cclxuICogXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwaXhlbEhlaWdodCBBIGhlaWdodCAocGl4ZWwgdW5pdHMpLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IEEgaGVpZ2h0IChkYXRhIHVuaXRzKS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZ2V0RGF0YUhlaWdodCA9IGZ1bmN0aW9uIChwaXhlbEhlaWdodClcclxue1xyXG4gICAgLy88dmFsaWRhdGlvbj5cclxuICAgIGlmICghaXNOdW1iZXIocGl4ZWxIZWlnaHQpKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhcy5nZXREYXRhSGVpZ2h0KHBpeGVsSGVpZ2h0KTogcGl4ZWxIZWlnaHQgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgIGlmIChwaXhlbEhlaWdodCA8IDApICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhcy5nZXREYXRhSGVpZ2h0KHBpeGVsSGVpZ2h0KTogcGl4ZWxIZWlnaHQgbXVzdCBiZSA+PSAwLicpO1xyXG4gICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICBpZiAocGl4ZWxIZWlnaHQgPT09IDApIHJldHVybiAwO1xyXG4gICAgdmFyIGRhdGFEaXN0YW5jZSA9IChwaXhlbEhlaWdodCAvIHRoaXMuX3ZpZXdQb3J0LmhlaWdodCgpKSAqIHRoaXMuX3ZpZXdCb3guaGVpZ2h0KCk7XHJcbiAgICByZXR1cm4gZGF0YURpc3RhbmNlO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBBZGp1c3RzIGEgYm91bmRpbmcgYm94IHRvIGZpdCBhIHJlY3RhbmdsZSBpbiBvcmRlciB0byBtYWludGFpbiB0aGUgYXNwZWN0IHJhdGlvLlxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1ZpZXdCb3h9IHZpZXdCb3ggVGhlIGJvdW5kaW5nIGJveC5cclxuICogQHBhcmFtIHtSZWN0YW5nbGV9IHJlY3QgVGhlIHJlY3RhbmdsZS5cclxuICovXHJcbkNhbnZhcy5wcm90b3R5cGUuZml0Vmlld0JveFRvVmlld1BvcnQgPSBmdW5jdGlvbiAodmlld0JveCwgcmVjdClcclxue1xyXG4gICAgdmFyIHN5ID0gdmlld0JveC5oZWlnaHQoKSAvIHJlY3QuaGVpZ2h0KCk7XHJcbiAgICB2YXIgc3ggPSB2aWV3Qm94LmhlaWdodCgpIC8gcmVjdC53aWR0aCgpO1xyXG5cclxuICAgIHZhciBzQkJveFgsIHNCQm94WSwgc0JCb3hXLCBzQkJveEg7IFxyXG5cclxuICAgIGlmIChzeSA+IHN4KVxyXG4gICAge1xyXG4gICAgICAgIHNCQm94WSA9IHZpZXdCb3gueU1pbigpO1xyXG4gICAgICAgIHNCQm94SCA9IHZpZXdCb3guaGVpZ2h0KCk7XHJcbiAgICAgICAgc0JCb3hXID0gKHJlY3Qud2lkdGgoKSAvIHJlY3QuaGVpZ2h0KCkpICogc0JCb3hIO1xyXG4gICAgICAgIHNCQm94WCA9IHZpZXdCb3gueE1pbigpIC0gKChzQkJveFcgLSB2aWV3Qm94LndpZHRoKCkpIC8gMik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzeCA+IHN5KVxyXG4gICAge1xyXG4gICAgICAgIHNCQm94WCA9IHZpZXdCb3gueE1pbigpO1xyXG4gICAgICAgIHNCQm94VyA9IHZpZXdCb3gud2lkdGgoKTtcclxuICAgICAgICBzQkJveEggPSAocmVjdC5oZWlnaHQoKSAvIHJlY3Qud2lkdGgoKSkgKiBzQkJveFc7XHJcbiAgICAgICAgc0JCb3hZID0gdmlld0JveC55TWluKCkgLSAoKHNCQm94SCAtIHZpZXdCb3guaGVpZ2h0KCkpIC8gMik7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgc0JCb3hYID0gdmlld0JveC54TWluKCk7XHJcbiAgICAgICAgc0JCb3hZID0gdmlld0JveC55TWluKCk7XHJcbiAgICAgICAgc0JCb3hXID0gdmlld0JveC53aWR0aCgpO1xyXG4gICAgICAgIHNCQm94SCA9IHZpZXdCb3guaGVpZ2h0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmlld0JveC54TWluKHNCQm94WCkueU1pbihzQkJveFkpLndpZHRoKHNCQm94VykuaGVpZ2h0KHNCQm94SCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhczsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4vKiBnbG9iYWxzIERFQlVHICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEV4cG9ydHMgdGhlIHtAbGluayBIdG1sQ2FudmFzfSBjbGFzcy5cclxuICogQGF1dGhvciBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCBGbG93aW5nQ2hhcnRzIDIwMTVcclxuICogQG1vZHVsZSBjYW52YXMvU3ZnQ2FudmFzIFxyXG4gKiBAcmVxdWlyZXMgY2FudmFzL0NhbnZhc1xyXG4gKiBAcmVxdWlyZXMgdXRpbFxyXG4gKi9cclxuXHJcbi8vIFJlcXVpcmVkIG1vZHVsZXMuXHJcbnZhciBDYW52YXMgICAgICA9IHJlcXVpcmUoJy4vQ2FudmFzJyk7XHJcbnZhciB1dGlsICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcclxudmFyIGV4dGVuZENsYXNzID0gdXRpbC5leHRlbmRDbGFzcztcclxuXHJcbi8qKiBcclxuICogQGNsYXNzZGVzYyBBIHdyYXBwZXIgY2xhc3MgZm9yIHJlbmRlcmluZyB0byBhIEhUTUw1IGNhbnZhcy5cclxuICpcclxuICogQGNsYXNzXHJcbiAqIEBhbGlhcyBIdG1sQ2FudmFzXHJcbiAqIEBhdWdtZW50cyBDYW52YXNcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBhdXRob3IgSiBDbGFyZVxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zLlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbb3B0aW9ucy5jb250YWluZXJdIFRoZSBodG1sIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIHJlbmRlcmVyLiBcclxuICovXHJcbmZ1bmN0aW9uIEh0bWxDYW52YXMgKG9wdGlvbnMpXHJcbntcclxuICAgIEh0bWxDYW52YXMuYmFzZUNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbn1cclxuZXh0ZW5kQ2xhc3MoQ2FudmFzLCBIdG1sQ2FudmFzKTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcbkh0bWxDYW52YXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIC8vIFB1YmxpYyBpbnN0YW5jZSBtZW1iZXJzLlxyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTsgLy8gVGhlIGRyYXdpbmcgY2FudmFzLlxyXG5cclxuICAgIC8vIFByaXZhdGUgaW5zdGFuY2UgbWVtYmVycy5cclxuICAgIHRoaXMuX2N0eCAgID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTsgICAgIC8vIFRoZSBkcmF3aW5nIGNvbnRleHQuXHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEBpbmhlcml0ZG9jXHJcbiAqL1xyXG5IdG1sQ2FudmFzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAgIHRoaXMuX2N0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcbkh0bWxDYW52YXMucHJvdG90eXBlLmRyYXdGaWxsID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgLy8gVE9ETyBvcGFjaXR5XHJcbiAgICB0aGlzLl9jdHguZmlsbFN0eWxlICAgICAgPSB0aGlzLmZpbGxDb2xvcigpO1xyXG4gICAgdGhpcy5fY3R4LmZpbGwoKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBAaW5oZXJpdGRvY1xyXG4gKi9cclxuSHRtbENhbnZhcy5wcm90b3R5cGUuZHJhd1N0cm9rZSA9IGZ1bmN0aW9uIChvcHRpb25zKVxyXG57XHJcbiAgICAvLyBUT0RPIE9wYWNpdHlcclxuICAgIHRoaXMuX2N0eC5zdHJva2VTdHlsZSAgICA9IHRoaXMubGluZUNvbG9yKCk7XHJcbiAgICB0aGlzLl9jdHgubGluZVdpZHRoICAgICAgPSB0aGlzLmxpbmVXaWR0aCgpO1xyXG4gICAgdGhpcy5fY3R4LmxpbmVKb2luICAgICAgID0gdGhpcy5saW5lSm9pbigpO1xyXG4gICAgdGhpcy5fY3R4LmxpbmVDYXAgICAgICAgID0gdGhpcy5saW5lQ2FwKCk7XHJcbiAgICB0aGlzLl9jdHguc3Ryb2tlKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcbkh0bWxDYW52YXMucHJvdG90eXBlLmNpcmNsZSA9IGZ1bmN0aW9uIChjeCwgY3ksIHIpXHJcbntcclxuICAgIHRoaXMuX2N0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuX2N0eC5hcmModGhpcy5nZXRQaXhlbFgoY3gpLCB0aGlzLmdldFBpeGVsWShjeSksIHIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcbkh0bWxDYW52YXMucHJvdG90eXBlLmVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaClcclxue1xyXG4gICAgdyA9IHRoaXMuZ2V0UGl4ZWxXaWR0aCh3KTtcclxuICAgIGggPSB0aGlzLmdldFBpeGVsSGVpZ2h0KGgpO1xyXG4gICAgeCA9IHRoaXMuZ2V0UGl4ZWxYKHgpO1xyXG4gICAgeSA9IHRoaXMuZ2V0UGl4ZWxZKHkpIC0gaDtcclxuXHJcbiAgICB2YXIga2FwcGEgPSAwLjU1MjI4NDgsXHJcbiAgICBveCA9ICh3IC8gMikgKiBrYXBwYSwgLy8gY29udHJvbCBwb2ludCBvZmZzZXQgaG9yaXpvbnRhbC5cclxuICAgIG95ID0gKGggLyAyKSAqIGthcHBhLCAvLyBjb250cm9sIHBvaW50IG9mZnNldCB2ZXJ0aWNhbC5cclxuICAgIHhlID0geCArIHcsICAgICAgICAgICAvLyB4LWVuZC5cclxuICAgIHllID0geSArIGgsICAgICAgICAgICAvLyB5LWVuZC5cclxuICAgIHhtID0geCArIHcgLyAyLCAgICAgICAvLyB4LW1pZGRsZS5cclxuICAgIHltID0geSArIGggLyAyOyAgICAgICAvLyB5LW1pZGRsZS5cclxuXHJcbiAgICB0aGlzLl9jdHguYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHltKTtcclxuICAgIHRoaXMuX2N0eC5iZXppZXJDdXJ2ZVRvKHgsIHltIC0gb3ksIHhtIC0gb3gsIHksIHhtLCB5KTtcclxuICAgIHRoaXMuX2N0eC5iZXppZXJDdXJ2ZVRvKHhtICsgb3gsIHksIHhlLCB5bSAtIG95LCB4ZSwgeW0pO1xyXG4gICAgdGhpcy5fY3R4LmJlemllckN1cnZlVG8oeGUsIHltICsgb3ksIHhtICsgb3gsIHllLCB4bSwgeWUpO1xyXG4gICAgdGhpcy5fY3R4LmJlemllckN1cnZlVG8oeG0gLSBveCwgeWUsIHgsIHltICsgb3ksIHgsIHltKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBAaW5oZXJpdGRvY1xyXG4gKi9cclxuSHRtbENhbnZhcy5wcm90b3R5cGUucmVjdCA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKVxyXG57XHJcbiAgICB3ID0gdGhpcy5nZXRQaXhlbFdpZHRoKHcpO1xyXG4gICAgaCA9IHRoaXMuZ2V0UGl4ZWxIZWlnaHQoaCk7XHJcbiAgICB4ID0gdGhpcy5nZXRQaXhlbFgoeCk7XHJcbiAgICB5ID0gdGhpcy5nZXRQaXhlbFkoeSkgLSBoO1xyXG5cclxuICAgIHRoaXMuX2N0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuX2N0eC5yZWN0KHgsIHksIHcsIGgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEBpbmhlcml0ZG9jXHJcbiAqL1xyXG5IdG1sQ2FudmFzLnByb3RvdHlwZS5saW5lID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKVxyXG57XHJcbiAgICB0aGlzLl9jdHguYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLl9jdHgubW92ZVRvKHRoaXMuZ2V0UGl4ZWxYKHgxKSwgdGhpcy5nZXRQaXhlbFkoeTEpKTtcclxuICAgIHRoaXMuX2N0eC5saW5lVG8odGhpcy5nZXRQaXhlbFgoeDIpLCB0aGlzLmdldFBpeGVsWSh5MikpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEBpbmhlcml0ZG9jXHJcbiAqL1xyXG5IdG1sQ2FudmFzLnByb3RvdHlwZS5wb2x5bGluZSA9IGZ1bmN0aW9uIChhcnJDb29yZHMpXHJcbntcclxuICAgIHRoaXMuX2N0eC5iZWdpblBhdGgoKTtcclxuICAgIHZhciBuID0gYXJyQ29vcmRzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSs9MilcclxuICAgIHtcclxuICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0UGl4ZWxYKGFyckNvb3Jkc1tpXSk7XHJcbiAgICAgICAgdmFyIHkgPSB0aGlzLmdldFBpeGVsWShhcnJDb29yZHNbaSsxXSk7XHJcbiAgICAgICAgaWYgKGkgPT09IDApICAgIHRoaXMuX2N0eC5tb3ZlVG8oeCwgeSk7XHJcbiAgICAgICAgZWxzZSAgICAgICAgICAgIHRoaXMuX2N0eC5saW5lVG8oeCwgeSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcbkh0bWxDYW52YXMucHJvdG90eXBlLnBvbHlnb24gPSBmdW5jdGlvbiAoYXJyQ29vcmRzKVxyXG57XHJcbiAgICB0aGlzLnBvbHlsaW5lKGFyckNvb3Jkcyk7XHJcbiAgICB0aGlzLl9jdHguY2xvc2VQYXRoKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSHRtbENhbnZhczsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4vKiBnbG9iYWxzIERFQlVHICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEV4cG9ydHMgdGhlIHtAbGluayBTdmdDYW52YXN9IGNsYXNzLlxyXG4gKiBAYXV0aG9yIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0IEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlIGNhbnZhcy9TdmdDYW52YXMgXHJcbiAqIEByZXF1aXJlcyBjYW52YXMvQ2FudmFzXHJcbiAqIEByZXF1aXJlcyB1dGlsXHJcbiAqL1xyXG5cclxuLy8gUmVxdWlyZWQgbW9kdWxlcy5cclxudmFyIENhbnZhcyAgICAgID0gcmVxdWlyZSgnLi9DYW52YXMnKTtcclxudmFyIHV0aWwgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xyXG52YXIgZXh0ZW5kQ2xhc3MgPSB1dGlsLmV4dGVuZENsYXNzO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIEEgd3JhcHBlciBjbGFzcyBmb3IgcmVuZGVyaW5nIHRvIGEgSFRNTDUgY2FudmFzLlxyXG4gKlxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIFN2Z0NhbnZhc1xyXG4gKiBAYXVnbWVudHMgQ2FudmFzXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAYXV0aG9yIEogQ2xhcmVcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucy5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW29wdGlvbnMuY29udGFpbmVyXSBUaGUgaHRtbCBlbGVtZW50IHRoYXQgd2lsbCBjb250YWluIHRoZSByZW5kZXJlci4gXHJcbiAqL1xyXG5mdW5jdGlvbiBTdmdDYW52YXMgKG9wdGlvbnMpXHJcbntcclxuICAgIFN2Z0NhbnZhcy5iYXNlQ29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxufVxyXG5leHRlbmRDbGFzcyhDYW52YXMsIFN2Z0NhbnZhcyk7XHJcblxyXG4vKiogXHJcbiAqIEBpbmhlcml0ZG9jXHJcbiAqL1xyXG5TdmdDYW52YXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIC8vIFByaXZhdGUgaW5zdGFuY2UgbWVtYmVycy5cclxuICAgIHRoaXMuX3N2Z05TICAgICAgICAgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnOyAvLyBOYW1lc3BhY2UgZm9yIFNWRyBlbGVtZW50cy5cclxuICAgIHRoaXMuX3N2Z0VsZW1lbnQgICAgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgc3ZnIGVsZW1lbnQgdGhhdCBpcyBwYXJ0IG9mIHRoZSBjdXJyZW50IGRyYXdpbmcgcm91dGluZS5cclxuXHJcbiAgICAvLyBQdWJsaWMgaW5zdGFuY2UgbWVtYmVycy5cclxuICAgIHRoaXMuY2FudmFzICAgICAgICAgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ3N2ZycpOyAgICAvLyBUaGUgbWFpbiBzdmcgZWxlbWVudC5cclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcblN2Z0NhbnZhcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICB3aGlsZSAodGhpcy5jYW52YXMuZmlyc3RDaGlsZCkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlQ2hpbGQodGhpcy5jYW52YXMuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcblN2Z0NhbnZhcy5wcm90b3R5cGUuZHJhd0ZpbGwgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICB0aGlzLmF0dHIodGhpcy5fc3ZnRWxlbWVudCwgXHJcbiAgICB7XHJcbiAgICAgICAgJ2ZpbGwnICAgICAgICAgICAgOiB0aGlzLmZpbGxDb2xvcigpLFxyXG4gICAgICAgICdmaWxsLW9wYWNpdHknICAgIDogdGhpcy5maWxsT3BhY2l0eSgpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBAaW5oZXJpdGRvY1xyXG4gKi9cclxuU3ZnQ2FudmFzLnByb3RvdHlwZS5kcmF3U3Ryb2tlID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgdGhpcy5hdHRyKHRoaXMuX3N2Z0VsZW1lbnQsIFxyXG4gICAge1xyXG4gICAgICAgICdzdHJva2UnICAgICAgICAgICAgOiB0aGlzLmxpbmVDb2xvcigpLFxyXG4gICAgICAgICdzdHJva2Utd2lkdGgnICAgICAgOiB0aGlzLmxpbmVXaWR0aCgpLFxyXG4gICAgICAgICdzdHJva2UtbGluZWpvaW4nICAgOiB0aGlzLmxpbmVKb2luKCksXHJcbiAgICAgICAgJ3N0cm9rZS1saW5lY2FwJyAgICA6IHRoaXMubGluZUNhcCgpLFxyXG4gICAgICAgICdzdHJva2Utb3BhY2l0eScgICAgOiB0aGlzLmxpbmVPcGFjaXR5KClcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEBpbmhlcml0ZG9jXHJcbiAqL1xyXG5TdmdDYW52YXMucHJvdG90eXBlLmNpcmNsZSA9IGZ1bmN0aW9uIChjeCwgY3ksIHIpXHJcbntcclxuICAgIHZhciBzdmdDaXJjbGUgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ2NpcmNsZScsICAgICAgIFxyXG4gICAge1xyXG4gICAgICAgICdjeCcgICAgOiB0aGlzLmdldFBpeGVsWChjeCksXHJcbiAgICAgICAgJ2N5JyAgICA6IHRoaXMuZ2V0UGl4ZWxZKGN5KSxcclxuICAgICAgICAncicgICAgIDogclxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jYW52YXMuYXBwZW5kQ2hpbGQoc3ZnQ2lyY2xlKTtcclxuICAgIHRoaXMuX3N2Z0VsZW1lbnQgPSBzdmdDaXJjbGU7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEBpbmhlcml0ZG9jXHJcbiAqL1xyXG5TdmdDYW52YXMucHJvdG90eXBlLmVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaClcclxue1xyXG4gICAgdyA9IHRoaXMuZ2V0UGl4ZWxXaWR0aCh3KTtcclxuICAgIGggPSB0aGlzLmdldFBpeGVsSGVpZ2h0KGgpO1xyXG4gICAgeCA9IHRoaXMuZ2V0UGl4ZWxYKHgpO1xyXG4gICAgeSA9IHRoaXMuZ2V0UGl4ZWxZKHkpIC0gaDtcclxuXHJcbiAgICB2YXIgcnggPSB3IC8gMjtcclxuICAgIHZhciByeSA9IGggLyAyO1xyXG4gICAgdmFyIGN4ID0geCArIHJ4O1xyXG4gICAgdmFyIGN5ID0geSArIHJ5O1xyXG5cclxuICAgIHZhciBzdmdFbGxpcHNlID0gdGhpcy5jcmVhdGVFbGVtZW50KCdlbGxpcHNlJywgICAgICAgXHJcbiAgICB7XHJcbiAgICAgICAgJ2N4JyAgICA6IGN4LFxyXG4gICAgICAgICdjeScgICAgOiBjeSxcclxuICAgICAgICAncngnICAgIDogcngsXHJcbiAgICAgICAgJ3J5JyAgICA6IHJ5XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNhbnZhcy5hcHBlbmRDaGlsZChzdmdFbGxpcHNlKTtcclxuICAgIHRoaXMuX3N2Z0VsZW1lbnQgPSBzdmdFbGxpcHNlO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBAaW5oZXJpdGRvY1xyXG4gKi9cclxuU3ZnQ2FudmFzLnByb3RvdHlwZS5yZWN0ID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpXHJcbntcclxuICAgIHcgPSB0aGlzLmdldFBpeGVsV2lkdGgodyk7XHJcbiAgICBoID0gdGhpcy5nZXRQaXhlbEhlaWdodChoKTtcclxuICAgIHggPSB0aGlzLmdldFBpeGVsWCh4KTtcclxuICAgIHkgPSB0aGlzLmdldFBpeGVsWSh5KSAtIGg7XHJcblxyXG4gICAgdmFyIHN2Z1JlY3QgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ3JlY3QnLCAgICAgICBcclxuICAgIHtcclxuICAgICAgICAneCcgICAgICAgICA6IHgsXHJcbiAgICAgICAgJ3knICAgICAgICAgOiB5LFxyXG4gICAgICAgICd3aWR0aCcgICAgIDogdyxcclxuICAgICAgICAnaGVpZ2h0JyAgICA6IGhcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY2FudmFzLmFwcGVuZENoaWxkKHN2Z1JlY3QpO1xyXG4gICAgdGhpcy5fc3ZnRWxlbWVudCA9IHN2Z1JlY3Q7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEBpbmhlcml0ZG9jXHJcbiAqL1xyXG5TdmdDYW52YXMucHJvdG90eXBlLmxpbmUgPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpXHJcbntcclxuICAgIHZhciBzdmdMaW5lID0gdGhpcy5jcmVhdGVFbGVtZW50KCdsaW5lJywgICAgICAgXHJcbiAgICB7XHJcbiAgICAgICAgJ3gxJyA6IHRoaXMuZ2V0UGl4ZWxYKHgxKSxcclxuICAgICAgICAneTEnIDogdGhpcy5nZXRQaXhlbFkoeTEpLFxyXG4gICAgICAgICd4MicgOiB0aGlzLmdldFBpeGVsWCh4MiksXHJcbiAgICAgICAgJ3kyJyA6IHRoaXMuZ2V0UGl4ZWxZKHkyKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jYW52YXMuYXBwZW5kQ2hpbGQoc3ZnTGluZSk7XHJcbiAgICB0aGlzLl9zdmdFbGVtZW50ID0gc3ZnTGluZTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcblN2Z0NhbnZhcy5wcm90b3R5cGUucG9seWxpbmUgPSBmdW5jdGlvbiAoYXJyQ29vcmRzKVxyXG57XHJcbiAgICB2YXIgc3ZnUG9seWxpbmUgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoJ3BvbHlsaW5lJywgICAgICAgXHJcbiAgICB7XHJcbiAgICAgICAgJ3BvaW50cycgOiB0aGlzLmdldFBvaW50c0FzU3RyaW5nKGFyckNvb3JkcylcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY2FudmFzLmFwcGVuZENoaWxkKHN2Z1BvbHlsaW5lKTtcclxuICAgIHRoaXMuX3N2Z0VsZW1lbnQgPSBzdmdQb2x5bGluZTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogQGluaGVyaXRkb2NcclxuICovXHJcblN2Z0NhbnZhcy5wcm90b3R5cGUucG9seWdvbiA9IGZ1bmN0aW9uIChhcnJDb29yZHMpXHJcbntcclxuICAgIHZhciBzdmdQb2x5Z29uID0gdGhpcy5jcmVhdGVFbGVtZW50KCdwb2x5Z29uJywgICAgICAgXHJcbiAgICB7XHJcbiAgICAgICAgJ3BvaW50cycgOiB0aGlzLmdldFBvaW50c0FzU3RyaW5nKGFyckNvb3JkcylcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY2FudmFzLmFwcGVuZENoaWxkKHN2Z1BvbHlnb24pO1xyXG4gICAgdGhpcy5fc3ZnRWxlbWVudCA9IHN2Z1BvbHlnb247XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGNvb3JkcyBbeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0LCAuLi5dIFxyXG4gKiB0byBhIGNvbW1hIHNlcGFyYXRlZCBzdHJpbmcgb2YgY29vcmRzICd4MSB5MSwgeDIgeTIsIHgzIHkzLCB4NCB5NCwgLi4uJy5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBhcnJDb29yZHMgVGhlIGxpc3Qgb2YgY29vcmRzLlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGxpc3Qgb2YgY29vcmRzLlxyXG4gKi9cclxuU3ZnQ2FudmFzLnByb3RvdHlwZS5nZXRQb2ludHNBc1N0cmluZyA9IGZ1bmN0aW9uIChhcnJDb29yZHMpXHJcbntcclxuICAgIHZhciBuID0gYXJyQ29vcmRzLmxlbmd0aDtcclxuICAgIHZhciBzdHJQb2ludHMgPSAnJztcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSs9MilcclxuICAgIHtcclxuICAgICAgICBpZiAoaSAhPT0gMCkgc3RyUG9pbnRzICs9ICcsJztcclxuICAgICAgICBzdHJQb2ludHMgKz0gJycgKyB0aGlzLmdldFBpeGVsWChhcnJDb29yZHNbaV0pICsgJyAnICsgdGhpcy5nZXRQaXhlbFkoYXJyQ29vcmRzW2krMV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0clBvaW50cztcclxufTtcclxuXHJcbi8qKiBcclxuICogQ3JlYXRlcyBhbiBlbGVtZW50IHdpdGggdGhlIGdpdmVuIGF0dHJpYnV0ZXMuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIGVsZW1lbnQgdHlwZS5cclxuICogQHJldHVybiB7YXR0cn0gYXR0ciBUaGUgbGlzdCBvZiBhdHRyaWJ1dGVzLlxyXG4gKi9cclxuU3ZnQ2FudmFzLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGF0dHIpXHJcbntcclxuICAgIHZhciBzdmdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMuX3N2Z05TLCB0eXBlKTtcclxuICAgIHRoaXMuYXR0cihzdmdFbGVtZW50LCBhdHRyKTtcclxuICAgIHJldHVybiBzdmdFbGVtZW50O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBTZXRzIHRoZSBhdHRyaWJ1dGVzIGZvciB0aGUgZ2l2ZW4gc3ZnIGVsZW1lbnQuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtTVkdFbGVtZW50fSBzdmdFbGVtZW50IFRoZSBzdmcgZWxlbWVudC5cclxuICogQHJldHVybiB7YXR0cn0gYXR0ciBUaGUgbGlzdCBvZiBhdHRyaWJ1dGVzLlxyXG4gKi9cclxuU3ZnQ2FudmFzLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gKHN2Z0VsZW1lbnQsIGF0dHIpXHJcbntcclxuICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF0dHIpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChhdHRyLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkgIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3ZnRWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcGVydHksIGF0dHJbcHJvcGVydHldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN2Z0NhbnZhczsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQ2FudmFzIHV0aWxpdHkgbW9kdWxlLlxyXG4gKiBAbW9kdWxlIGNhbnZhcy91dGlsXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG57XHJcblx0LyoqIFxyXG5cdCAqIENoZWNrIGlmIGNhbnZhcyBpcyBzdXBwb3J0ZWQuXHJcblx0ICogQGZ1bmN0aW9uIGlzU3VwcG9ydGVkXHJcblx0ICovXHJcblx0aXNTdXBwb3J0ZWQgOiBmdW5jdGlvbiAoKVxyXG5cdHtcclxuICAgICAgICByZXR1cm4gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0O1xyXG5cdH1cclxufTsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4vKiBnbG9iYWxzIERFQlVHICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEV4cG9ydHMgdGhlIHtAbGluayBQb2ludH0gY2xhc3MuXHJcbiAqIEBhdXRob3IgSm9uYXRoYW4gQ2xhcmUgXHJcbiAqIEBjb3B5cmlnaHQgRmxvd2luZ0NoYXJ0cyAyMDE1XHJcbiAqIEBtb2R1bGUgZ2VvbS9Qb2ludCBcclxuICogQHJlcXVpcmVzIHV0aWxcclxuICovXHJcblxyXG4vLyBSZXF1aXJlZCBtb2R1bGVzLlxyXG52YXIgdXRpbCAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsJyk7XHJcbnZhciBpc051bWJlciAgICA9IHV0aWwuaXNOdW1iZXI7XHJcblxyXG4vKiogXHJcbiAqIEBjbGFzc2Rlc2MgQSBQb2ludCBkZWZpbmVkIGJ5IGl0cyA8Y29kZT54PC9jb2RlPiBhbmQgPGNvZGU+eTwvY29kZT4gXHJcbiAqIFxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIFBvaW50XHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAY29uc3RydWN0b3JcclxuICpcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IFt4ID0gMF0gVGhlIHggY29vcmQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeSA9IDBdIFRoZSB5IGNvb3JkLlxyXG4gKi9cclxuZnVuY3Rpb24gUG9pbnQgKHgsIHkpXHJcbntcclxuICAgIC8vIFByaXZhdGUgaW5zdGFuY2UgbWVtYmVycy5cclxuICAgIHRoaXMuX3ggPSBudWxsOyAvLyBUaGUgeCBjb29yZC5cclxuICAgIHRoaXMuX3kgPSBudWxsOyAvLyBUaGUgeSBjb29yZC5cclxuXHJcbiAgICB4ID0geCAhPT0gdW5kZWZpbmVkID8geCA6IDA7XHJcbiAgICB5ID0geSAhPT0gdW5kZWZpbmVkID8geSA6IDA7XHJcbiAgICB0aGlzLnNldENvb3Jkcyh4LCB5KTtcclxufVxyXG5cclxuLyoqIFxyXG4gKiBTZXQgdGhlIGNvb3JkaW5hdGVzLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IFt4XSBUaGUgeCBjb29yZC5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt5XSBUaGUgeSBjb29yZC5cclxuICogQHJldHVybiB7UG9pbnR9IDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLnNldENvb3JkcyA9IGZ1bmN0aW9uICh4LCB5KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkgdGhpcy54KHgpO1xyXG4gICAgICAgIGlmICh5ICE9PSB1bmRlZmluZWQpIHRoaXMueSh5KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB4IGNvb3JkIG9mIHRoZSBsZWZ0IGVkZ2UuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2Nvb3JkXSBUaGUgY29vcmRpbmF0ZS5cclxuICogQHJldHVybiB7bnVtYmVyfFBvaW50fSBUaGUgY29vcmRpbmF0ZSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5Qb2ludC5wcm90b3R5cGUueCA9IGZ1bmN0aW9uIChjb29yZClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcihjb29yZCkpIHRocm93IG5ldyBFcnJvcignUG9pbnQueChjb29yZCk6IGNvb3JkIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feCA9IGNvb3JkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feDtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgeSBjb29yZCBvZiB0aGUgdG9wIGVkZ2UuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2Nvb3JkXSBUaGUgY29vcmRpbmF0ZS5cclxuICogQHJldHVybiB7bnVtYmVyfFBvaW50fSBUaGUgY29vcmRpbmF0ZSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5Qb2ludC5wcm90b3R5cGUueSA9IGZ1bmN0aW9uIChjb29yZClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcihjb29yZCkpIHRocm93IG5ldyBFcnJvcignUG9pbnQueShjb29yZCk6IGNvb3JkIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feSA9IGNvb3JkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyBhIGNsb25lIG9mIHRoaXMgUG9pbnQuICAgICAgICBcclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcmV0dXJuIHtQb2ludH0gVGhlIFBvaW50LiAgIFxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLl94LCB0aGlzLl95KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7IiwiLyoganNoaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cclxuLyogZ2xvYmFscyBERUJVRyAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQGZpbGVvdmVydmlldyBFeHBvcnRzIHRoZSB7QGxpbmsgUmVjdGFuZ2xlfSBjbGFzcy5cclxuICogQGF1dGhvciBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCBGbG93aW5nQ2hhcnRzIDIwMTVcclxuICogQG1vZHVsZSBnZW9tL1JlY3RhbmdsZSBcclxuICogQHJlcXVpcmVzIHV0aWxcclxuICovXHJcblxyXG4vLyBSZXF1aXJlZCBtb2R1bGVzLlxyXG52YXIgdXRpbCAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsJyk7XHJcbnZhciBpc051bWJlciAgICA9IHV0aWwuaXNOdW1iZXI7XHJcblxyXG4vKiogXHJcbiAqIEBjbGFzc2Rlc2MgQSByZWN0YW5nbGUgZGVmaW5lZCBieSBpdHMgPGNvZGU+eDwvY29kZT4sIDxjb2RlPnk8L2NvZGU+IFxyXG4gKiA8Y29kZT53aWR0aDwvY29kZT4gYW5kIDxjb2RlPmhlaWdodDwvY29kZT4uXHJcbiAqIFxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIFJlY3RhbmdsZVxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeCA9IDBdIFRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeSA9IDBdIFRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2lkdGggPSAxMDBdIFRoZSB3aWR0aC5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtoZWlnaHQgPSAxMDBdIFRoZSBoZWlnaHQuXHJcbiAqL1xyXG5mdW5jdGlvbiBSZWN0YW5nbGUgKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbntcclxuICAgIC8vIFByaXZhdGUgaW5zdGFuY2UgbWVtYmVycy5cclxuICAgIHRoaXMuX3ggPSBudWxsOyAvLyBUaGUgeCBjb29yZCBvZiB0aGUgdG9wIGxlZnQgY29ybmVyLlxyXG4gICAgdGhpcy5feSA9IG51bGw7IC8vIFRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAgICB0aGlzLl93ID0gbnVsbDsgLy8gVGhlIHdpZHRoLlxyXG4gICAgdGhpcy5faCA9IG51bGw7IC8vIFRoZSBoZWlnaHQuXHJcblxyXG4gICAgeCA9IHggIT09IHVuZGVmaW5lZCA/IHggOiAwO1xyXG4gICAgeSA9IHkgIT09IHVuZGVmaW5lZCA/IHkgOiAwO1xyXG4gICAgd2lkdGggPSB3aWR0aCAhPT0gdW5kZWZpbmVkID8gd2lkdGggOiAxMDA7XHJcbiAgICBoZWlnaHQgPSBoZWlnaHQgIT09IHVuZGVmaW5lZCA/IGhlaWdodCA6IDEwMDtcclxuICAgIHRoaXMuc2V0RGltZW5zaW9ucyh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxufVxyXG5cclxuLyoqIFxyXG4gKiBTZXQgdGhlIGRpbWVuc2lvbnMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hdIFRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeV0gVGhlIHkgY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt3XSBUaGUgd2lkdGguXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaF0gVGhlIGhlaWdodC5cclxuICogQHJldHVybiB7UmVjdGFuZ2xlfSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblJlY3RhbmdsZS5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZCkgdGhpcy54KHgpO1xyXG4gICAgICAgIGlmICh5ICE9PSB1bmRlZmluZWQpIHRoaXMueSh5KTtcclxuICAgICAgICBpZiAodyAhPT0gdW5kZWZpbmVkKSB0aGlzLndpZHRoKHcpO1xyXG4gICAgICAgIGlmIChoICE9PSB1bmRlZmluZWQpIHRoaXMuaGVpZ2h0KGgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHggY29vcmQgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29vcmRdIFRoZSBjb29yZGluYXRlLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8UmVjdGFuZ2xlfSBUaGUgY29vcmRpbmF0ZSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5SZWN0YW5nbGUucHJvdG90eXBlLnggPSBmdW5jdGlvbiAoY29vcmQpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghaXNOdW1iZXIoY29vcmQpKSB0aHJvdyBuZXcgRXJyb3IoJ1JlY3RhbmdsZS54KGNvb3JkKTogY29vcmQgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgICAgICB0aGlzLl94ID0gY29vcmQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl94O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2Nvb3JkXSBUaGUgY29vcmRpbmF0ZS5cclxuICogQHJldHVybiB7bnVtYmVyfFJlY3RhbmdsZX0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuUmVjdGFuZ2xlLnByb3RvdHlwZS55ID0gZnVuY3Rpb24gKGNvb3JkKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIWlzTnVtYmVyKGNvb3JkKSkgdGhyb3cgbmV3IEVycm9yKCdSZWN0YW5nbGUueShjb29yZCk6IGNvb3JkIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feSA9IGNvb3JkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feTtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgd2lkdGguXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ddIFRoZSB3aWR0aC5cclxuICogQHJldHVybiB7bnVtYmVyfFJlY3RhbmdsZX0gVGhlIHdpZHRoIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblJlY3RhbmdsZS5wcm90b3R5cGUud2lkdGggPSBmdW5jdGlvbiAodylcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcih3KSkgdGhyb3cgbmV3IEVycm9yKCdSZWN0YW5nbGUud2lkdGgodyk6IHcgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgICAgICBpZiAodyA8IDApICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY3RhbmdsZS53aWR0aCh3KTogdyBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5fdyA9IHc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl93O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSBoZWlnaHQuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2hdIFRoZSBoZWlnaHQuXHJcbiAqIEByZXR1cm4ge251bWJlcnxSZWN0YW5nbGV9IFRoZSBoZWlnaHQgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuUmVjdGFuZ2xlLnByb3RvdHlwZS5oZWlnaHQgPSBmdW5jdGlvbiAoaClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcihoKSkgdGhyb3cgbmV3IEVycm9yKCdSZWN0YW5nbGUuaGVpZ2h0KGgpOiBoIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgaWYgKGggPCAwKSAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWN0YW5nbGUuaGVpZ2h0KGgpOiBoIG11c3QgYmUgPj0gMC4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgICAgICB0aGlzLl9oID0gaDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX2g7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgYSBjbG9uZSBvZiB0aGlzIHJlY3RhbmdsZS4gICAgICAgIFxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEByZXR1cm4ge1JlY3RhbmdsZX0gVGhlIHJlY3RhbmdsZS4gICBcclxuICovXHJcblJlY3RhbmdsZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLl94LCB0aGlzLl95LCB0aGlzLl93LCB0aGlzLl9oKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVjdGFuZ2xlOyIsIi8qIGpzaGludCBicm93c2VyaWZ5OiB0cnVlICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEV4cG9ydHMgdGhlIHtAbGluayBWaWV3Qm94fSBjbGFzcy5cclxuICogQGF1dGhvciBKb25hdGhhbiBDbGFyZSBcclxuICogQGNvcHlyaWdodCBGbG93aW5nQ2hhcnRzIDIwMTVcclxuICogQG1vZHVsZSBnZW9tL1ZpZXdCb3ggXHJcbiAqIEByZXF1aXJlcyB1dGlsXHJcbiAqL1xyXG5cclxuLy8gUmVxdWlyZWQgbW9kdWxlcy5cclxudmFyIHV0aWwgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xyXG52YXIgaXNOdW1iZXIgICAgPSB1dGlsLmlzTnVtYmVyO1xyXG5cclxuLyoqIFxyXG4gKiBAY2xhc3NkZXNjIEFuIGFyZWEgZGVmaW5lZCBieSBpdHMgcG9zaXRpb24sIGFzIGluZGljYXRlZCBcclxuICogYnkgaXRzIGJvdHRvbS1sZWZ0IGNvcm5lciBwb2ludCAoPGNvZGU+eE1pbjwvY29kZT4sIDxjb2RlPnlNaW48L2NvZGU+KSBcclxuICogYW5kIHRvcC1yaWdodCBjb3JuZXIgcG9pbnQgKDxjb2RlPnhNYXg8L2NvZGU+LCA8Y29kZT55TWF4PC9jb2RlPikuXHJcbiAqIFxyXG4gKiBAY2xhc3NcclxuICogQGFsaWFzIFZpZXdCb3hcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hNaW4gPSAwXSBUaGUgeCBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3lNaW4gPSAwXSBUaGUgeSBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hNYXggPSAxMDBdIFRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3lNYXggPSAxMDBdIFRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKi9cclxuZnVuY3Rpb24gVmlld0JveCAoeE1pbiwgeU1pbiwgeE1heCwgeU1heClcclxue1xyXG4gICAgLy8gUHJpdmF0ZSBpbnN0YW5jZSBtZW1iZXJzLlxyXG4gICAgdGhpcy5feE1pbiAgICAgID0gbnVsbDsgLy8gVGhlIHggY29vcmQgb2YgdGhlIGJvdHRvbSBsZWZ0IGNvcm5lci5cclxuICAgIHRoaXMuX3hNYXggICAgICA9IG51bGw7IC8vIFRoZSB4IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gICAgdGhpcy5feENlbnRlciAgID0gbnVsbDsgLy8gVGhlIHggY29vcmQgb2YgdGhlIGNlbnRlci5cclxuICAgIHRoaXMuX3dpZHRoICAgICA9IG51bGw7IC8vIFRoZSB3aWR0aC5cclxuICAgIHRoaXMuX3lNaW4gICAgICA9IG51bGw7IC8vIFRoZSB5IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAgICB0aGlzLl95TWF4ICAgICAgPSBudWxsOyAvLyBUaGUgeSBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICAgIHRoaXMuX3lDZW50ZXIgICA9IG51bGw7IC8vIFRoZSB5IGNvb3JkIG9mIHRoZSBjZW50ZXIuXHJcbiAgICB0aGlzLl9oZWlnaHQgICAgPSBudWxsOyAvLyBUaGUgaGVpZ2h0LlxyXG5cclxuICAgIHhNaW4gPSB4TWluICE9PSB1bmRlZmluZWQgPyB4TWluIDogMDtcclxuICAgIHlNaW4gPSB5TWluICE9PSB1bmRlZmluZWQgPyB5TWluIDogMDtcclxuICAgIHhNYXggPSB4TWF4ICE9PSB1bmRlZmluZWQgPyB4TWF4IDogMTAwO1xyXG4gICAgeU1heCA9IHlNYXggIT09IHVuZGVmaW5lZCA/IHlNYXggOiAxMDA7XHJcbiAgICB0aGlzLnNldENvb3Jkcyh4TWluLCB5TWluLCB4TWF4LCB5TWF4KTtcclxufVxyXG5cclxuLyoqIFxyXG4gKiBTZXQgdGhlIGRpbWVuc2lvbnMuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hNaW5dIFRoZSB4IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeU1pbl0gVGhlIHkgY29vcmQgb2YgdGhlIGJvdHRvbSBsZWZ0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt4TWF4XSBUaGUgeCBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICogQHBhcmFtIHtudW1iZXJ9IFt5TWF4XSBUaGUgeSBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICogQHJldHVybiB7Vmlld0JveH0gPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5WaWV3Qm94LnByb3RvdHlwZS5zZXRDb29yZHMgPSBmdW5jdGlvbiAoeE1pbiwgeU1pbiwgeE1heCwgeU1heClcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh4TWluICE9PSB1bmRlZmluZWQpIHRoaXMueE1pbih4TWluKTtcclxuICAgICAgICBpZiAoeU1pbiAhPT0gdW5kZWZpbmVkKSB0aGlzLnlNaW4oeU1pbik7XHJcbiAgICAgICAgaWYgKHhNYXggIT09IHVuZGVmaW5lZCkgdGhpcy54TWF4KHhNYXgpO1xyXG4gICAgICAgIGlmICh5TWF4ICE9PSB1bmRlZmluZWQpIHRoaXMueU1heCh5TWF4KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB4IGNvb3JkIG9mIHRoZSBib3R0b20gbGVmdCBjb3JuZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hdIFRoZSBjb29yZGluYXRlLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Vmlld0JveH0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUueE1pbiA9IGZ1bmN0aW9uICh4KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIWlzTnVtYmVyKHgpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3gueE1pbih4KTogeCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3hNaW4gPSB4O1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gTWF0aC5hYnModGhpcy5feE1heCAtIHRoaXMuX3hNaW4pO1xyXG4gICAgICAgIHRoaXMuX3hDZW50ZXIgPSB0aGlzLl94TWluICsgKHRoaXMuX3dpZHRoIC8gMik7IFxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feE1pbjtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgeCBjb29yZCBvZiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICpcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeF0gVGhlIGNvb3JkaW5hdGUuXHJcbiAqIEByZXR1cm4ge251bWJlcnxWaWV3Qm94fSBUaGUgY29vcmRpbmF0ZSBpZiBubyBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCBvdGhlcndpc2UgPGNvZGU+dGhpczwvY29kZT4uXHJcbiAqL1xyXG5WaWV3Qm94LnByb3RvdHlwZS54TWF4ID0gZnVuY3Rpb24gKHgpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghaXNOdW1iZXIoeCkpIHRocm93IG5ldyBFcnJvcignVmlld0JveC54TWF4KHgpOiB4IG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5feE1heCA9IHg7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSBNYXRoLmFicyh0aGlzLl94TWF4IC0gdGhpcy5feE1pbik7XHJcbiAgICAgICAgdGhpcy5feENlbnRlciA9IHRoaXMuX3hNaW4gKyAodGhpcy5fd2lkdGggLyAyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX3hNYXg7XHJcbn07XHJcblxyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB4IGNvb3JkIG9mIHRoZSBjZW50ZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3hdIFRoZSBjb29yZGluYXRlLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Vmlld0JveH0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUueENlbnRlciA9IGZ1bmN0aW9uICh4KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIWlzTnVtYmVyKHgpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3gueENlbnRlcih4KTogeCBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3hDZW50ZXIgPSB4O1xyXG4gICAgICAgIHRoaXMuX3hNaW4gID0gdGhpcy5feENlbnRlciAtICh0aGlzLl93aWR0aCAvIDIpO1xyXG4gICAgICAgIHRoaXMuX3hNYXggID0gdGhpcy5feENlbnRlciArICh0aGlzLl93aWR0aCAvIDIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZWxzZSByZXR1cm4gdGhpcy5feENlbnRlcjtcclxufTtcclxuXHJcblxyXG4vKiogXHJcbiAqIEdldCBvciBzZXQgdGhlIHdpZHRoLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IFt3XSBUaGUgd2lkdGguXHJcbiAqIEByZXR1cm4ge251bWJlcnxWaWV3Qm94fSBUaGUgd2lkdGggaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUud2lkdGggPSBmdW5jdGlvbiAodylcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcih3KSkgIHRocm93IG5ldyBFcnJvcignVmlld0JveC53aWR0aCh3KTogdyBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIGlmICh3IDwgMCkgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3gud2lkdGgodyk6IHcgbXVzdCBiZSA+PSAwLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdztcclxuICAgICAgICB0aGlzLl94TWF4ID0gdGhpcy5feE1pbiArIHRoaXMuX3dpZHRoO1xyXG4gICAgICAgIHRoaXMuX3hDZW50ZXIgPSB0aGlzLl94TWluICsgKHRoaXMuX3dpZHRoIC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl93aWR0aDtcclxufTtcclxuXHJcbi8qKiBcclxuICogR2V0IG9yIHNldCB0aGUgeSBjb29yZCBvZiB0aGUgYm90dG9tIGxlZnQgY29ybmVyLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IFt5XSBUaGUgY29vcmRpbmF0ZS5cclxuICogQHJldHVybiB7bnVtYmVyfFZpZXdCb3h9IFRoZSBjb29yZGluYXRlIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLnlNaW4gPSBmdW5jdGlvbiAoeSlcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcih5KSkgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LnlNaW4oeSk6IHkgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgICAgICB0aGlzLl95TWluID0geTtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBNYXRoLmFicyh0aGlzLl95TWF4IC0gdGhpcy5feU1pbik7XHJcbiAgICAgICAgdGhpcy5feUNlbnRlciA9IHRoaXMuX3lNaW4gKyAodGhpcy5faGVpZ2h0IC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl95TWluO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB5IGNvb3JkIG9mIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gKlxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogQHBhcmFtIHtudW1iZXJ9IFt5XSBUaGUgY29vcmRpbmF0ZS5cclxuICogQHJldHVybiB7bnVtYmVyfFZpZXdCb3h9IFRoZSBjb29yZGluYXRlIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLnlNYXggPSBmdW5jdGlvbiAoeSlcclxue1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICAgIC8vPHZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKCFpc051bWJlcih5KSkgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LnlNYXgoeSk6IHkgbXVzdCBiZSBhIG51bWJlci4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgICAgICB0aGlzLl95TWF4ID0geTtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBNYXRoLmFicyh0aGlzLl95TWF4IC0gdGhpcy5feU1pbik7XHJcbiAgICAgICAgdGhpcy5feUNlbnRlciA9IHRoaXMuX3lNaW4gKyAodGhpcy5faGVpZ2h0IC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl95TWF4O1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSB5IGNvb3JkIG9mIHRoZSBjZW50ZXIuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ldIFRoZSBjb29yZGluYXRlLlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ8Vmlld0JveH0gVGhlIGNvb3JkaW5hdGUgaWYgbm8gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgb3RoZXJ3aXNlIDxjb2RlPnRoaXM8L2NvZGU+LlxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUueUNlbnRlciA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIWlzTnVtYmVyKHkpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3gueUNlbnRlcih5KTogeSBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG4gICAgICAgIC8vPC92YWxpZGF0aW9uPlxyXG4gICAgICAgIHRoaXMuX3lDZW50ZXIgPSB5O1xyXG4gICAgICAgIHRoaXMuX3lNaW4gID0gdGhpcy5feUNlbnRlciAtICh0aGlzLl9oZWlnaHQgLyAyKTtcclxuICAgICAgICB0aGlzLl95TWF4ICA9IHRoaXMuX3lDZW50ZXIgKyAodGhpcy5faGVpZ2h0IC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHJldHVybiB0aGlzLl95Q2VudGVyO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBHZXQgb3Igc2V0IHRoZSBoZWlnaHQuXHJcbiAqXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2hdIFRoZSBoZWlnaHQuXHJcbiAqIEByZXR1cm4ge251bWJlcnxWaWV3Qm94fSBUaGUgaGVpZ2h0IGlmIG5vIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIG90aGVyd2lzZSA8Y29kZT50aGlzPC9jb2RlPi5cclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLmhlaWdodCA9IGZ1bmN0aW9uIChoKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoIWlzTnVtYmVyKGgpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3guaGVpZ2h0KGgpOiBoIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcbiAgICAgICAgaWYgKGggPCAwKSAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LmhlaWdodChoKTogaCBtdXN0IGJlID49IDAuJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaDtcclxuICAgICAgICB0aGlzLl95TWF4ID0gdGhpcy5feU1pbiArIHRoaXMuX2hlaWdodDtcclxuICAgICAgICB0aGlzLl95Q2VudGVyID0gdGhpcy5feU1pbiArICh0aGlzLl9oZWlnaHQgLyAyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyBhIGNsb25lIG9mIHRoaXMgVmlld0JveC4gICAgICAgIFxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEByZXR1cm4ge1ZpZXdCb3h9IFRoZSBWaWV3Qm94LiAgIFxyXG4gKi9cclxuVmlld0JveC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZpZXdCb3godGhpcy5feE1pbiwgdGhpcy5feU1pbiwgdGhpcy5feE1heCwgdGhpcy5feU1heCk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIFZpZXdCb3ggZXF1YWxzIHRvIHRoaXMgb25lLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7Vmlld0JveH0gdmIgVGhlIFZpZXdCb3guXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUsIGlmIHRoZSBWaWV3Qm94IGlzIGVxdWFsIHRvIHRoaXMgb25lLCBvdGhlcndpc2UgZmFsc2UuXHJcbiAqL1xyXG5WaWV3Qm94LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAodmIpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghKHZiIGluc3RhbmNlb2YgVmlld0JveCkpIHRocm93IG5ldyBFcnJvcignVmlld0JveC5lcXVhbHModmIpOiB2YiBtdXN0IGJlIGEgVmlld0JveC4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAodmIuZ2V0WE1pbigpICE9PSB0aGlzLl94TWluKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHZiLmdldFlNaW4oKSAhPT0gdGhpcy5feU1pbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh2Yi5nZXRYTWF4KCkgIT09IHRoaXMuX3hNYXgpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmIuZ2V0WU1heCgpICE9PSB0aGlzLl95TWF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHRocm93IG5ldyBFcnJvcignVmlld0JveC5lcXVhbHModmIpOiB2YiBoYXMgbm90IGJlZW4gZGVmaW5lZC4nKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyB0cnVlIGlmIGEgVmlld0JveCBpbnRlcnNlY3RzIHRoaXMgb25lLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7Vmlld0JveH0gdmIgVGhlIFZpZXdCb3guXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUsIGlmIHRoZSBWaWV3Qm94IGludGVyY2VwdHMgdGhpcyBvbmUsIG90aGVyd2lzZSBmYWxzZS5cclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLmludGVyc2VjdHMgPSBmdW5jdGlvbiAodmIpXHJcbntcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgICAvLzx2YWxpZGF0aW9uPlxyXG4gICAgICAgIGlmICghKHZiIGluc3RhbmNlb2YgVmlld0JveCkpIHRocm93IG5ldyBFcnJvcignVmlld0JveC5pbnRlcnNlY3RzKHZiKTogdmIgbXVzdCBiZSBhIFZpZXdCb3guJyk7XHJcbiAgICAgICAgLy88L3ZhbGlkYXRpb24+XHJcbiAgICAgICAgaWYgKHZiLmdldFhNaW4oKSA+IHRoaXMuX3hNYXgpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmIuZ2V0WE1heCgpIDwgdGhpcy5feE1pbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh2Yi5nZXRZTWluKCkgPiB0aGlzLl95TWF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHZiLmdldFlNYXgoKSA8IHRoaXMuX3lNaW4pIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKCdWaWV3Qm94LmludGVyc2VjdHModmIpOiB2YiBoYXMgbm90IGJlZW4gZGVmaW5lZC4nKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogUmV0dXJucyB0cnVlIGlmIGEgVmlld0JveCBpcyBjb250YWluZWQgd2l0aGluIHRoaXMgb25lLlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIEBwYXJhbSB7Vmlld0JveH0gdmIgVGhlIFZpZXdCb3guXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUsIGlmIHRoZSBWaWV3Qm94IGlzIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBvbmUsIG90aGVyd2lzZSBmYWxzZS5cclxuICovXHJcblZpZXdCb3gucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKHZiKVxyXG57XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgICAgLy88dmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAoISh2YiBpbnN0YW5jZW9mIFZpZXdCb3gpKSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3guY29udGFpbnModmIpOiB2YiBtdXN0IGJlIGEgVmlld0JveC4nKTtcclxuICAgICAgICAvLzwvdmFsaWRhdGlvbj5cclxuICAgICAgICBpZiAodmIuZ2V0WE1pbigpIDwgdGhpcy5feE1pbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh2Yi5nZXRYTWF4KCkgPiB0aGlzLl94TWF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHZiLmdldFlNaW4oKSA8IHRoaXMuX3lNaW4pIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmIuZ2V0WU1heCgpID4gdGhpcy5feU1heCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1ZpZXdCb3guY29udGFpbnModmIpOiB2YiBoYXMgbm90IGJlZW4gZGVmaW5lZC4nKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmlld0JveDsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vLyBHcmFiIGFuIGV4aXN0aW5nIG5hbWVzcGFjZSBvYmplY3QsIG9yIGNyZWF0ZSBhIGJsYW5rIG9iamVjdCBpZiBpdCBkb2Vzbid0IGV4aXN0LlxyXG4vLyBBZGQgdGhlIG1vZHVsZXMuXHJcbi8vIE9ubHkgbmVlZCB0byByZXF1aXJlIHRoZSB0b3AtbGV2ZWwgbW9kdWxlcywgYnJvd3NlcmlmeVxyXG4vLyB3aWxsIHdhbGsgdGhlIGRlcGVuZGVuY3kgZ3JhcGggYW5kIGxvYWQgZXZlcnl0aGluZyBjb3JyZWN0bHkuXHJcbnZhciBmbG93aW5nY2hhcnRzID0gd2luZG93LmZsb3dpbmdjaGFydHMgfHwgXHJcbntcclxuICAgIHV0aWwgOiByZXF1aXJlKCcuL2NhbnZhcy91dGlsJylcclxufTtcclxuXHJcbnJlcXVpcmUoJy4vcGx1Z2lucy9qcXVlcnlwbHVnaW4nKTtcclxuXHJcbi8vIFJlcGxhY2UvQ3JlYXRlIHRoZSBnbG9iYWwgbmFtZXNwYWNlXHJcbndpbmRvdy5mbG93aW5nY2hhcnRzID0gZmxvd2luZ2NoYXJ0czsiLCIvKiBqc2hpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XHJcbnZhciBIdG1sQ2FudmFzID0gcmVxdWlyZSgnLi4vY2FudmFzL0h0bWxDYW52YXMnKTtcclxudmFyIFN2Z0NhbnZhcyA9IHJlcXVpcmUoJy4uL2NhbnZhcy9TdmdDYW52YXMnKTtcclxuXHJcbiQuZm4uZmxvd2luZ2NoYXJ0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSBcclxue1x0XHJcblx0b3B0aW9ucy5jb250YWluZXIgPSB0aGlzWzBdO1xyXG5cclxuICAgIHZhciBjaGFydCA9IG51bGw7IFxyXG4gICAgaWYgKG9wdGlvbnMucmVuZGVyZXIgPT09ICdzdmcnKVxyXG4gICAgICAgIGNoYXJ0PSBuZXcgU3ZnQ2FudmFzKG9wdGlvbnMpO1xyXG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjaGFydD0gbmV3IEh0bWxDYW52YXMob3B0aW9ucyk7XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59OyIsIi8qIGpzaGludCBicm93c2VyaWZ5OiB0cnVlICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IENvbnRhaW5zIHV0aWxpdHkgZnVuY3Rpb25zLlxyXG4gKiBAYXV0aG9yIEpvbmF0aGFuIENsYXJlIFxyXG4gKiBAY29weXJpZ2h0IEZsb3dpbmdDaGFydHMgMjAxNVxyXG4gKiBAbW9kdWxlIHV0aWwgXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBcclxue1xyXG4gICAgLyoqIFxyXG4gICAgICogQ2hlY2sgaWYgbiBpcyBhIHZhbGlkIG51bWJlci4gUmV0dXJucyBmYWxzZSBpZiBuIGlzIGVxdWFsIHRvIE5hTiwgSW5maW5pdHksIC1JbmZpbml0eSBvciBhIHN0cmluZyBlZyAnMTAnLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Kn0gbiBUaGUgbnVtYmVyIHRvIHRlc3QuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiBuIGlzIGEgbnVtYmVyLCBvdGhlcndpc2UgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIGlzTnVtYmVyIDogZnVuY3Rpb24gKG4pXHJcbiAgICB7XHJcbiAgICAgICAgLy8gKHR5cGVvZiBuID09ICdudW1iZXInKSAgIFJlamVjdCBvYmplY3RzIHRoYXQgYXJlbnQgbnVtYmVyIHR5cGVzIGVnIG51bWJlcnMgc3RvcmVkIGFzIHN0cmluZ3Mgc3VjaCBhcyAnMTAnLlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICBOYU4sIEluZmluaXR5IGFuZCAtSW5maW5pdHkgYXJlIG51bWJlciB0eXBlcyBzbyB3aWxsIHBhc3MgdGhpcyB0ZXN0LlxyXG4gICAgICAgIC8vIGlzRmluaXRlKG4pICAgICAgICAgICAgICBSZWplY3QgaW5maW5pdGUgbnVtYmVycy5cclxuICAgICAgICAvLyAhaXNOYU4obikpICAgICAgICAgICAgICAgUmVqZWN0IE5hTi5cclxuICAgICAgICByZXR1cm4gKHR5cGVvZiBuID09ICdudW1iZXInKSAmJiBpc0Zpbml0ZShuKSAmJiAhaXNOYU4obik7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIENoZWNrIGlmIGMgaXMgYSB2YWxpZCBjb2xvci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyp9IGMgVGhlIG51bWJlciB0byB0ZXN0LlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSwgaWYgYyBpcyBhIG51bWJlciwgb3RoZXJ3aXNlIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBpc0NvbG9yIDogZnVuY3Rpb24gKGMpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gVE9ETyB0ZXN0IGZvciByZ2IgY29sb3JzLlxyXG4gICAgICAgIHJldHVybiAvKF4jWzAtOUEtRl17Nn0kKXwoXiNbMC05QS1GXXszfSQpL2kudGVzdCgnI2FjMycpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBDaGVjayBpZiBjIGlzIGEgdmFsaWQgY29sb3IuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsqfSBjIFRoZSBudW1iZXIgdG8gdGVzdC5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUsIGlmIGMgaXMgYSBudW1iZXIsIG90aGVyd2lzZSBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgaXNIZXhDb2xvciA6IGZ1bmN0aW9uIChjKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAvKF4jWzAtOUEtRl17Nn0kKXwoXiNbMC05QS1GXXszfSQpL2kudGVzdCgnI2FjMycpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBFeHRlbmQgYW4gb2JqZWN0IGEgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBhZGQgdG8gdGhlIGZpcnN0IG9uZS5cclxuICAgICAqL1xyXG4gICAgZXh0ZW5kT2JqZWN0IDogZnVuY3Rpb24gKGEsIGIpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShrZXkpKSBhW2tleV0gPSBiW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZXh0ZW5kIG9uZSBjbGFzcyB3aXRoIGFub3RoZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJhc2VDbGFzcyBUaGUgY2xhc3MgZnJvbSB3aGljaCB0byBpbmhlcml0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN1YkNsYXNzIFRoZSBpbmhlcml0aW5nIGNsYXNzLCBvciBzdWJjbGFzcy5cclxuICAgICAqL1xyXG4gICAgZXh0ZW5kQ2xhc3MgOiBmdW5jdGlvbihiYXNlQ2xhc3MsIHN1YkNsYXNzKVxyXG4gICAge1xyXG4gICAgICAgIGZ1bmN0aW9uIEluaGVyaXRhbmNlKCkge31cclxuICAgICAgICBJbmhlcml0YW5jZS5wcm90b3R5cGUgPSBiYXNlQ2xhc3MucHJvdG90eXBlO1xyXG4gICAgICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IG5ldyBJbmhlcml0YW5jZSgpO1xyXG4gICAgICAgIHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzO1xyXG4gICAgICAgIHN1YkNsYXNzLmJhc2VDb25zdHJ1Y3RvciA9IGJhc2VDbGFzcztcclxuICAgICAgICBzdWJDbGFzcy5zdXBlckNsYXNzID0gYmFzZUNsYXNzLnByb3RvdHlwZTtcclxuICAgIH1cclxufTsiXX0=
