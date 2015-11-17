/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link CartesianCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/CartesianCanvas 
 * @requires geom/BoundingBox
 * @requires geom/Rectangle
 * @requires geom/Point
 * @requires renderers/CanvasRenderer
 * @requires util
 */

// Required modules.
var BoundingBox     = require('../geom/BoundingBox');
var Rectangle       = require('../geom/Rectangle');
var Point           = require('../geom/Point');
var Canvas          = require('./HtmlCanvas');
var util            = require('../util');
var extendClass     = util.extendClass;
var extendObject    = util.extendObject;
var fitBBoxToRect   = util.fitBBoxToRect;
var isNumber        = util.isNumber;

/** 
 * @classdesc Maps data coords to pixel coords and vice versa.
 *
 * <p>The pixel coords are defined by a rectangle [pixelCoords]{@link CartesianCanvas#pixelCoords}.
 * Pixel coords are relative to the top left corner of the chart.</p>
 *
 * <p>The data coords are defined by a bounding box [dataCoords]{@link CartesianCanvas#dataCoords}.
 * Data coords are relative to the bottom left corner of the chart.</p>
 * 
 * <p>The data coords may be adjusted to maintain the aspect ratio by setting 
 * the value of {@link maintainAspectRatio} to true.</p>
 *
 * @class
 * @alias CartesianCanvas
 * @augments Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The options.
 * @param {number} [options.dimensions.x] The x coord of the top left corner (pixel units).
 * @param {number} [options.dimensions.y] The y coord of the top left corner (pixel units).
 * @param {number} [options.dimensions.width] The width (pixel units).
 * @param {number} [options.dimensions.height] The height (pixel units).
 * @param {number} [options.xAxis.min] The x coord of the top left corner (data units).
 * @param {number} [options.xAxis.max] The x coord of the right edge (data units).
 * @param {number} [options.yAxis.min] The y coord of the bottom edge (data units).
 * @param {number} [options.yAxis.max] The y coord of the top left corner (data units).
 */
function CartesianCanvas (options)
{
    CartesianCanvas.baseConstructor.call(this, options);

    // Private instance members.
    this._rect = new Rectangle();    // The rectangle defining the pixel coords.
    this._bBox = new BoundingBox();  // The bounding box defining the data coords.

    // Public instance members.

    /** 
     * <p>If set to <code>true</code> the data space is
     * adjusted to maintain the aspect ratio.</p>
     * 
     * <p>If set to <code>false</code> the data space stretches
     * to fit the pixel space. This will generally result
     * in the aspect ratio changing (a stretching effect).</p>
     * 
     * @since 0.1.0
     * @type boolean
     * @default false
     */
    this.maintainAspectRatio = false;

    // Handle options.
    // TODO options.container can be id or element - test for string.
    options = options !== undefined ? options : {};

    // Default options.
    var o =
    {
        chart :
        {


        }
    };
    extendObject(o, options);

    // Setup for first render.
    this._rect.setDimensions(0, 0, this.width(), this.height());
    this.render();
}
extendClass(Canvas, CartesianCanvas);

/** 
 * @inheritdoc
 */
Canvas.prototype.onResize = function (w, h)
{
    this._rect.setDimensions(0, 0, w, h);
    this.render();
};

CartesianCanvas.prototype.render = function()
{
    this.clear();

    var w = this._rect.width();
    var h = this._rect.height();

    this.dataRect(0, 0, 50, 50).fillColor('#00f500').fill();
    this.dataEllipse(0, 0, 50, 50).fillColor('#f50000').fill();
    this.dataCircle(0, 0, 50).fillColor('#0000f5').fill();
 
    /*for (var i = 0; i < 5; i++)
    {
        this.rect(Math.random()*w, 
            Math.random()*h, 
            Math.random()*50, 
            Math.random()*50).fill({color:'#f5f5f5'}).stroke({color:'#cccccc'});

        this.circle(Math.random()*w, 
            Math.random()*h, 
            Math.random()*50).fillColor('#ff0000').fill().stroke();

        this.circle(Math.random()*w, 
            Math.random()*h, 
            Math.random()*50).fill({color:'#ccf5f5'}).stroke({color:'#ccccff', width:5});

        this.lineColor('#0000ff').lineWidth(10).rect(Math.random()*w, 
            Math.random()*h, 
            Math.random()*50, 
            Math.random()*50).fillColor('#ff00ff').stroke().fill();

        this.lineWidth(10).circle(Math.random()*w, 
            Math.random()*h, 
            Math.random()*50).stroke().fill();
    }*/
};

// Methods for changing the pixel or data dimensions.

/** 
 * Get or set the data dimensions.
 *
 * @since 0.1.0
 * @param {number} [xMin] The x coord of the bottom left corner.
 * @param {number} [yMin] The y coord of the bottom left corner.
 * @param {number} [xMax] The x coord of the top right corner.
 * @param {number} [yMax] The y coord of the top right corner.
 * @return {BoundingBox|CartesianCanvas} The data coords as a BoundingBox if no arguments are supplied, otherwise <code>this</code>.
 */
CartesianCanvas.prototype.dataDimensions = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._bBox.setDimensions(xMin, yMin, xMax, yMax);
        if (this.maintainAspectRatio) fitBBoxToRect(this._bBox, this._rect);
        return this;
    }
    return this._bBox.clone();
};

/** 
 * Get or set the pixel dimensions.
 *
 * @since 0.1.0
 * @param {number} [x] The x coord of the top left corner.
 * @param {number} [y] The y coord of the top left corner.
 * @param {number} [w] The width.
 * @param {number} [h] The height.
 * @return {Rectangle|CartesianCanvas} The pixel coords as a Rectangle if no arguments are supplied, otherwise <code>this</code>.
 */
CartesianCanvas.prototype.pixelDimensions = function (x, y, w, h)
{
    if (arguments.length > 0)
    {
        this._rect.setDimensions(x, y, w, h);
        if (this.maintainAspectRatio) fitBBoxToRect(this._bBox, this._rect);
        return this;
    }
    return this._rect.clone();
};

// Methods for mapping data coords to pixel coords and vice versa.

/** 
 * Converts a point from data units to pixel units.
 * 
 * @param {Point} dataPoint A point (data units).
 * @return {Point} A point (pixel units).
 */
CartesianCanvas.prototype.getPixelPoint = function (dataPoint)
{
    var x = this.getPixelX(dataPoint.x());
    var y = this.getPixelY(dataPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a bounding box (data units) to a rectangle (pixel units).
 * 
 * @param {BoundingBox} bBox A bounding box (data units).
 * @return {Rectangle} A rectangle (pixel units).
 */
CartesianCanvas.prototype.getPixelRect = function (bBox)
{
    var x = this.getPixelX(bBox.xMin());
    var y = this.getPixelY(bBox.yMax());
    var w = this.getPixelWidth(bBox.width());
    var h = this.getPixelHeight(bBox.height());
    return new Rectangle(x, y, w, h);
};

/** 
 * Converts an xcoord from data units to pixel units.
 * 
 * @param {number} dataX An xcoord (data units).
 * @return {number} The xcoord (pixel units).
 */
CartesianCanvas.prototype.getPixelX = function (dataX)
{
    //<validation>
    if (!isNumber(dataX)) throw new Error('CartesianCanvas.getPixelX(dataX): dataX must be a number.');
    //</validation>
    var px = this._rect.x() + this.getPixelWidth(dataX - this._bBox.xMin());
    return px;
};

/** 
 * Converts a ycoord from data units to pixel units.
 * 
 * @param {number} dataY A ycoord (data units).
 * @return {number} The ycoord (pixel units).
 */
CartesianCanvas.prototype.getPixelY = function (dataY)
{
    //<validation>
    if (!isNumber(dataY)) throw new Error('CartesianCanvas.getPixelY(dataY): dataY must be a number.');
    //</validation>
    var py =  this._rect.y() + this._rect.height() - this.getPixelHeight(dataY - this._bBox.yMin());
    return py;
};

/** 
 * Converts a width from data units to pixel units.
 * 
 * @param {number} dataWidth A width (data units).
 * @return {number} The width (pixel units).
 */
CartesianCanvas.prototype.getPixelWidth = function (dataWidth)
{
    //<validation>
    if (!isNumber(dataWidth)) throw new Error('CartesianCanvas.getPixelWidth(dataHeight): dataWidth must be a number.');
    if (dataWidth < 0)        throw new Error('CartesianCanvas.getPixelWidth(dataHeight): dataWidth must be >= 0.');
    //</validation>
    if (dataWidth === 0) return 0;
    var pixelDistance  = (dataWidth / this._bBox.width()) * this._rect.width();
    return pixelDistance;
};

/** 
 * Converts a height from data units to pixel units.
 * 
 * @param {number} dataHeight A height (data units).
 * @return {number} The height (pixel units).
 */
CartesianCanvas.prototype.getPixelHeight = function (dataHeight)
{
    //<validation>
    if (!isNumber(dataHeight)) throw new Error('CartesianCanvas.getPixelHeight(dataHeight): dataHeight must be a number.');
    if (dataHeight < 0)        throw new Error('CartesianCanvas.getPixelHeight(dataHeight): dataHeight must be >= 0.');
    //</validation>
    if (dataHeight === 0) return 0;
    var pixelDistance = (dataHeight / this._bBox.height()) * this._rect.height();
    return pixelDistance;
};

/** 
 * Converts a point from pixel units to data units.
 * 
 * @param {Point} pixelPoint A point (pixel units).
 * @return {Point} A point (data units).
 */
CartesianCanvas.prototype.getDataPoint = function (pixelPoint)
{
    var x = this.getDataX(pixelPoint.x());
    var y = this.getDataY(pixelPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a rectangle (pixel units) to a bBox (data units).
 * 
 * @param {Rectangle} pixelCoords A rectangle (pixel units).
 * @return {BoundingBox} A bBox (data units).
 */
CartesianCanvas.prototype.getDataCoords = function (pixelCoords)
{
    var xMin = this.getPixelX(pixelCoords.x());
    var yMax = this.getPixelY(pixelCoords.y());
    var xMax = xMin + this.getPixelWidth(pixelCoords.width());
    var yMin = yMax - this.getPixelHeight(pixelCoords.height());
    return new BoundingBox(xMin, yMin, xMax, yMax);
};

/** 
 * Converts an xcoord from pixel units to data units.
 * 
 * @param {number} pixelX An xcoord (pixel units).
 * @return {number} An xcoord (data units).
 */
CartesianCanvas.prototype.getDataX = function (pixelX)
{
    //<validation>
    if (!isNumber(pixelX)) throw new Error('CartesianCanvas.getDataX(pixelX): pixelX must be a number.');
    //</validation>
    var dataX = this._bBox.xMin() + this.getDataWidth(pixelX);
    return dataX;
};

/** 
 * Converts a ycoord from pixel units to data units.
 * 
 * @param {number} pixelY A ycoord (pixel units).
 * @return {number} A ycoord (data units).
 */
CartesianCanvas.prototype.getDataY = function (pixelY)
{
    //<validation>
    if (!isNumber(pixelY)) throw new Error('CartesianCanvas.getDataY(pixelY): pixelY must be a number.');
    //</validation>
    var dataY = this._bBox.yMin() + this.getDataHeight(this._rect.height() - pixelY);
    return dataY;
};

/** 
 * Converts a width from pixel units to data units.
 * 
 * @param {number} pixelWidth A width (pixel units).
 * @return {number} A width (data units).
 */
CartesianCanvas.prototype.getDataWidth = function (pixelWidth)
{
    //<validation>
    if (!isNumber(pixelWidth)) throw new Error('CartesianCanvas.getDataWidth(pixelWidth): pixelWidth must be a number.');
    if (pixelWidth < 0)        throw new Error('CartesianCanvas.getDataWidth(pixelWidth): pixelWidth must be >= 0.');
    //</validation>
    if (pixelWidth === 0) return 0;
    var dataDistance = (pixelWidth / this._rect.width()) * this._bBox.width();
    return dataDistance;
};

/** 
 * Converts a height from pixel units to data units.
 * 
 * @param {number} pixelHeight A height (pixel units).
 * @return {number} A height (data units).
 */
CartesianCanvas.prototype.getDataHeight = function (pixelHeight)
{
    //<validation>
    if (!isNumber(pixelHeight)) throw new Error('CartesianCanvas.getDataHeight(pixelHeight): pixelHeight must be a number.');
    if (pixelHeight < 0)        throw new Error('CartesianCanvas.getDataHeight(pixelHeight): pixelHeight must be >= 0.');
    //</validation>
    if (pixelHeight === 0) return 0;
    var dataDistance = (pixelHeight / this._rect.height()) * this._bBox.height();
    return dataDistance;
};

// Graphics methods.

/** 
 * Draws a circle using data coords.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the centre of the circle.
 * @param {number} cy The y position of the centre of the circle.
 * @param {number} r The circle radius.
 * @return {CartesianCanvas} <code>this</code>.
 */
CartesianCanvas.prototype.dataCircle = function (cx, cy, r)
{
    return this.circle(this.getPixelX(cx),this.getPixelY(cy), r);
};

/** 
 * Draws an ellipse using data coords.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CartesianCanvas} <code>this</code>.
 */
CartesianCanvas.prototype.dataEllipse = function (x, y, w, h)
{
    var pw = this.getPixelWidth(w);
    var ph = this.getPixelHeight(h);
    var px = this.getPixelX(x);
    var py = this.getPixelY(y) - ph;
    return this.ellipse(px, py, pw, ph);
};

/** 
 * Draws a rectangle using data coords.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CartesianCanvas} <code>this</code>.
 */
CartesianCanvas.prototype.dataRect = function (x, y, w, h)
{
    var pw = this.getPixelWidth(w);
    var ph = this.getPixelHeight(h);
    var px = this.getPixelX(x);
    var py = this.getPixelY(y) - ph;
    return this.rect(px, py, pw, ph);
};

/** 
 * Draws a line using data coords.
 *
 * @since 0.1.0
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @return {CartesianCanvas} <code>this</code>.
 */
CartesianCanvas.prototype.dataLine = function (x1, y1, x2, y2)
{
    return this.line(this.getPixelX(x1), 
                    this.getPixelY(y1), 
                    this.getPixelX(x2), 
                    this.getPixelY(y2));
};

/** 
 * Draws a point using data coords.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the centre of the point.
 * @param {number} cy The y position of the centre of the point.
 * @param {number} size The point size.
 * @param {number} type The point point.
 * @return {CartesianCanvas} <code>this</code>.
 */
CartesianCanvas.prototype.dataPoint = function (cx, cy, size, type)
{
    return this;
};

/** 
 * Draws a polyline using data coords.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of coordinates of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {CartesianCanvas} <code>this</code>.
 */
CartesianCanvas.prototype.dataPolyline = function (arrCoords)
{
    var arrPixelCoords = arrCoords.map(function (coord, index) 
    {
        if (coord % 2 === 0)    return this.getPixelX(coord); // x.
        else                    return this.getPixelY(coord); // y.
    });
    return this.polyline(arrPixelCoords);
};

/** 
 * Draws a polygon using data coords.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of coordinates of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {CartesianCanvas} <code>this</code>.
 */
CartesianCanvas.prototype.dataPolygon = function (arrCoords)
{
    var arrPixelCoords = arrCoords.map(function (coord, index) 
    {
        if (coord % 2 === 0)    return this.getPixelX(coord); // x.
        else                    return this.getPixelY(coord); // y.
    });
    return this.polygon(arrPixelCoords);
};


module.exports = CartesianCanvas;