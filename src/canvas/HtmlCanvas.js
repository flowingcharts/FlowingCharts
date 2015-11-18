/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link HtmlCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/HtmlCanvas
 * @requires geom/ViewBox
 * @requires geom/Rectangle
 * @requires geom/Point
 * @requires renderers/Canvas
 * @requires util
 */

// Required modules.
var Canvas          = require('./Canvas');
var ViewBox         = require('../geom/ViewBox');
var Rectangle       = require('../geom/Rectangle');
var Point           = require('../geom/Point');
var util            = require('../util');
var extendClass     = util.extendClass;
var extendObject    = util.extendObject;
var fitBBoxToRect   = util.fitBBoxToRect;
var isNumber        = util.isNumber;

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

    // Private instance members.
    this._viewPort      = new Rectangle();                  // The rectangle defining the pixel coords.
    this._viewBox       = new ViewBox();                    // The viewBox defining the data coords.
    this._viewBoxIsSet  = false;                            // Indicates if the viewBox has been set.
    this._canvas        = document.createElement('canvas'); // The drawing canvas.
    this._ctx           = this._canvas.getContext('2d');    // The drawing context.
    
    // Append canvas to container and set its initial size.
    if (this._options.container)
    {
        // Append canvas to parent container.
        var container = this._options.container;
        container.appendChild(this._canvas);

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
            }, 100);
        });
    }

    this._viewPort.setDimensions(0, 0, this.width(), this.height());
    //this._viewBox.setCoords(0, 0, this.width(), this.height());
    this.viewBox(0, 0, 100, 100);
    this.render();
}
extendClass(Canvas, HtmlCanvas);

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.canvasElement = function ()
{
    return this._canvas;
}; 

// Geometry.

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.viewBox = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._viewBoxIsSet = true;
        this._viewBox.setCoords(xMin, yMin, xMax, yMax);
        return this;
    }
    else return this._viewBox;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.width = function ()
{
    return parseInt(this._canvas.getAttribute('width'));
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.height = function ()
{
    return parseInt(this._canvas.getAttribute('height'));
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.setSize = function (w, h)
{
    //<validation>
    if (!isNumber(w)) throw new Error('Canvas.setSize(w): w must be a number.');
    if (w < 0)        throw new Error('Canvas.setSize(w): w must be >= 0.');
    if (!isNumber(h)) throw new Error('Canvas.setSize(h): h must be a number.');
    if (h < 0)        throw new Error('Canvas.setSize(h): h must be >= 0.');
    //</validation>

    if (w !== this.width() || h !== this.height())
    {
        this._canvas.setAttribute('width', w);
        this._canvas.setAttribute('height', h);
        this._viewPort.setDimensions(0, 0, w, h);
        if (this._viewBoxIsSet === false) this._viewBox.setCoords(0, 0, w, h);
        this.render();
    }
};

// Drawing.

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.clear = function ()
{
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
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
    cx = this._getPixelX(cx);
    cy = this._getPixelY(cy);

    this._ctx.beginPath();
    this._ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.ellipse = function (x, y, w, h)
{
    w = this._getPixelWidth(w);
    h = this._getPixelHeight(h);
    x = this._getPixelX(x);
    y = this._getPixelY(y) - h;

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
    w = this._getPixelWidth(w);
    h = this._getPixelHeight(h);
    x = this._getPixelX(x);
    y = this._getPixelY(y) - h;

    this._ctx.beginPath();
    this._ctx.rect(x, y, w, h);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.line = function (x1, y1, x2, y2)
{
    x1 = this._getPixelX(x1);
    y1 = this._getPixelY(y1); 
    x2 = this._getPixelX(x2);
    y2 = this._getPixelY(y2);

    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x1, y1);
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
        var x = this._getPixelX(arrCoords[i]);
        var y = this._getPixelY(arrCoords[i+1]);
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

// Mapping data coords to pixel coords in order to mimic SVG viewBox functionality.

/** 
 * Converts a point from data units to pixel units.
 * 
 * @private
 * @param {Point} dataPoint A point (data units).
 * @return {Point} A point (pixel units).
 */
HtmlCanvas.prototype._getPixelPoint = function (dataPoint)
{
    var x = this._getPixelX(dataPoint.x());
    var y = this._getPixelY(dataPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a bounding box (data units) to a rectangle (pixel units).
 * 
 * @private
 * @param {BoundingBox} viewBox A bounding box (data units).
 * @return {Rectangle} A rectangle (pixel units).
 */
HtmlCanvas.prototype._getPixelRect = function (viewBox)
{
    var x = this._getPixelX(viewBox.xMin());
    var y = this._getPixelY(viewBox.yMax());
    var w = this._getPixelWidth(viewBox.width());
    var h = this._getPixelHeight(viewBox.height());
    return new Rectangle(x, y, w, h);
};

/** 
 * Converts an x coord from data units to pixel units.
 * 
 * @private
 * @param {number} dataX An x coord (data units).
 * @return {number} The x coord (pixel units).
 */
HtmlCanvas.prototype._getPixelX = function (dataX)
{
    //<validation>
    if (!isNumber(dataX)) throw new Error('HtmlCanvas._getPixelX(dataX): dataX must be a number.');
    //</validation>
    var px = this._viewPort.x() + this._getPixelWidth(dataX - this._viewBox.xMin());
    return px;
};

/** 
 * Converts a y coord from data units to pixel units.
 * 
 * @private
 * @param {number} dataY A y coord (data units).
 * @return {number} The y coord (pixel units).
 */
HtmlCanvas.prototype._getPixelY = function (dataY)
{
    //<validation>
    if (!isNumber(dataY)) throw new Error('HtmlCanvas._getPixelY(dataY): dataY must be a number.');
    //</validation>
    var py =  this._viewPort.y() + this._viewPort.height() - this._getPixelHeight(dataY - this._viewBox.yMin());
    return py;
};

/** 
 * Converts a width from data units to pixel units.
 * 
 * @private
 * @param {number} dataWidth A width (data units).
 * @return {number} The width (pixel units).
 */
HtmlCanvas.prototype._getPixelWidth = function (dataWidth)
{
    //<validation>
    if (!isNumber(dataWidth)) throw new Error('HtmlCanvas._getPixelWidth(dataHeight): dataWidth must be a number.');
    if (dataWidth < 0)        throw new Error('HtmlCanvas._getPixelWidth(dataHeight): dataWidth must be >= 0.');
    //</validation>
    if (dataWidth === 0) return 0;
    var pixelDistance  = (dataWidth / this._viewBox.width()) * this._viewPort.width();
    return pixelDistance;
};

/** 
 * Converts a height from data units to pixel units.
 * 
 * @private
 * @param {number} dataHeight A height (data units).
 * @return {number} The height (pixel units).
 */
HtmlCanvas.prototype._getPixelHeight = function (dataHeight)
{
    //<validation>
    if (!isNumber(dataHeight)) throw new Error('HtmlCanvas._getPixelHeight(dataHeight): dataHeight must be a number.');
    if (dataHeight < 0)        throw new Error('HtmlCanvas._getPixelHeight(dataHeight): dataHeight must be >= 0.');
    //</validation>
    if (dataHeight === 0) return 0;
    var pixelDistance = (dataHeight / this._viewBox.height()) * this._viewPort.height();
    return pixelDistance;
};

module.exports = HtmlCanvas;