/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link CartesianCoords} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          geom/CartesianCoords 
 * @requires        utils/util
 * @requires        geom/ViewBox
 * @requires        geom/Rectangle
 * @requires        geom/Point
 */

// Required modules.
var ViewBox    = require('./ViewBox');
var Rectangle  = require('./Rectangle');
var Point      = require('./Point');
var util       = require('../utils/util');

/** 
 * @classdesc Maps a data space to a pixel space and vice versa.
 *
 * @class
 * @alias CartesianCoords
 * @since 0.1.0
 * @constructor
 *
 * @param {Object}      [options]           The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function CartesianCoords ()
{
    // Private instance members.    
    this._viewPort  = new Rectangle();  // The rectangle defining the pixel coords.
    this._viewBox   = new ViewBox();    // The viewBox defining the data coords.

    /** 
     * If set to <code>true</code> the viewBox is adjusted to maintain the aspect ratio.
     * If set to <code>false</code> the viewBox stretches to fill the viewPort.
     * 
     * @since 0.1.0
     * @type boolean
     * @default false
     */
    this.preserveAspectRatio = false;
}

/** 
 * A rectangle that defines the drawing area (in pixels) within the coordinate space.
 *
 * @since 0.1.0
 *
 * @param {number} [x = 0]          The x coord of the top left corner.
 * @param {number} [y = 0]          The y coord of the top left corner.
 * @param {number} [width = 100]    The width.
 * @param {number} [height = 100]   The height.
 *
 * @return {Rectangle|CartesianCoords} A Rectangle that defineds the viewPort if no arguments are supplied, otherwise <code>this</code>.
 */
CartesianCoords.prototype.viewPort = function (x, y, width, height)
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
 * The value of the viewBox specifies a rectangle in user space which is mapped to the bounds of the coordinate space. 
 * The viewBox has its origin at the bottom left corner of the coordinate space with the 
 * positive x-axis pointing towards the right, the positive y-axis pointing up.
 *
 * @since 0.1.0
 *
 * @param {number} [xMin = 0]   The x coord of the bottom left corner.
 * @param {number} [yMin = 0]   The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 *
 * @return {ViewBox|CartesianCoords} The ViewBox if no arguments are supplied, otherwise <code>this</code>.
 */
CartesianCoords.prototype.viewBox = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._viewBox.setCoords(xMin, yMin, xMax, yMax);
        if (this.preserveAspectRatio) this.fitViewBoxToViewPort(this._viewBox, this._viewPort);
        return this;
    }
    else return this._viewBox;
};


/** 
 * Converts a point from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {Point} dataPoint A point (data units).
 *
 * @return {Point} A point (pixel units).
 */
CartesianCoords.prototype.getPixelPoint = function (dataPoint)
{
    var x = this.getPixelX(dataPoint.x());
    var y = this.getPixelY(dataPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a bounding box (data units) to a rectangle (pixel units).
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} viewBox A bounding box (data units).
 *
 * @return {Rectangle} A rectangle (pixel units).
 */
CartesianCoords.prototype.getPixelRect = function (viewBox)
{
    var x = this.getPixelX(viewBox.xMin());
    var y = this.getPixelY(viewBox.yMax());
    var w = this.getPixelDimensionX(viewBox.width());
    var h = this.getPixelDimensionY(viewBox.height());
    return new Rectangle(x, y, w, h);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number[]} arrData An array of coords (data units).
 *
 * @return {number[]} An array of coords (pixel units).
 */
CartesianCoords.prototype.getPixelArray = function (arrData)
{
    var me = this;
    var arrPixel = arrData.map(function(num , index)
    {
        if (index % 2)  return me.getPixelY(num);
        else            return me.getPixelX(num);
    });
    return arrPixel;
};

/** 
 * Converts an x coord from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataX An x coord (data units).
 *
 * @return {number} An x coord (pixel units).
 */
CartesianCoords.prototype.getPixelX = function (dataX)
{
    //<validation>
    if (!util.isNumber(dataX)) throw new Error('CartesianCoords.getPixelX(dataX): dataX must be a number.');
    //</validation>
    var px = this._viewPort.x() + this.getPixelDimensionX(dataX - this._viewBox.xMin());
    return px;
};

/** 
 * Converts a y coord from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataY A y coord (data units).
 *
 * @return {number} A y coord (pixel units).
 */
CartesianCoords.prototype.getPixelY = function (dataY)
{
    //<validation>
    if (!util.isNumber(dataY)) throw new Error('CartesianCoords.getPixelY(dataY): dataY must be a number.');
    //</validation>
    var py =  this._viewPort.y() + this._viewPort.height() - this.getPixelDimensionY(dataY - this._viewBox.yMin());
    return py;
};

/** 
 * Converts an x dimension from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataDimensionX An x dimension (data units).
 *
 * @return {number} An x dimension (pixel units).
 */
CartesianCoords.prototype.getPixelDimensionX = function (dataDimensionX)
{
    //<validation>
    if (!util.isNumber(dataDimensionX)) throw new Error('CartesianCoords.getPixelDimensionX(dataDimensionY): dataDimensionX must be a number.');
    //</validation>
    if (dataDimensionX === 0) return 0;
    var pixelDimensionX  = (dataDimensionX / this._viewBox.width()) * this._viewPort.width();
    return pixelDimensionX;
};

/** 
 * Converts a y dimension from data units to pixel units.
 * 
 * @since 0.1.0
 *
 * @param {number} dataDimensionY A y dimension (data units).
 *
 * @return {number} A y dimension (pixel units).
 */
CartesianCoords.prototype.getPixelDimensionY = function (dataDimensionY)
{
    //<validation>
    if (!util.isNumber(dataDimensionY)) throw new Error('CartesianCoords.getPixelDimensionY(dataDimensionY): dataDimensionY must be a number.');
    //</validation>
    if (dataDimensionY === 0) return 0;
    var pixelDimensionY = (dataDimensionY / this._viewBox.height()) * this._viewPort.height();
    return pixelDimensionY;
};

/** 
 * Converts a point from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {Point} pixelPoint A point (pixel units).
 *
 * @return {Point} A point (data units).
 */
CartesianCoords.prototype.getDataPoint = function (pixelPoint)
{
    var x = this.getDataX(pixelPoint.x());
    var y = this.getDataY(pixelPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a rectangle (pixel units) to a viewBox (data units).
 * 
 * @since 0.1.0
 *
 * @param {Rectangle} pixelCoords A rectangle (pixel units).
 *
 * @return {ViewBox} A viewBox (data units).
 */
CartesianCoords.prototype.getDataCoords = function (pixelCoords)
{
    var xMin = this.getDataX(pixelCoords.x());
    var yMax = this.getDataY(pixelCoords.y());
    var xMax = xMin + this.getDataDimensionX(pixelCoords.width());
    var yMin = yMax - this.getPDataHeight(pixelCoords.height());
    return new ViewBox(xMin, yMin, xMax, yMax);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number[]} arrPixel An array of coords (pixel units).
 *
 * @return {number[]} An array of coords (data units).
 */
CartesianCoords.prototype.getDataArray = function (arrPixel)
{
    var me = this;
    var arrData = arrPixel.map(function(num , index)
    {
        if (index % 2)  return me.getDataY(num);
        else            return me.getDataX(num);
    });
    return arrData;
};

/** 
 * Converts an x coord from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelX An x coord (pixel units).
 *
 * @return {number} An x coord (data units).
 */
CartesianCoords.prototype.getDataX = function (pixelX)
{
    //<validation>
    if (!util.isNumber(pixelX)) throw new Error('CartesianCoords.getDataX(pixelX): pixelX must be a number.');
    //</validation>
    var px = pixelX - this._viewPort.x();
    var dataX = this._viewBox.xMin() + this.getDataDimensionX(px);
    return dataX;
};

/** 
 * Converts a y coord from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelY A y coord (pixel units).
 *
 * @return {number} A y coord (data units).
 */
CartesianCoords.prototype.getDataY = function (pixelY)
{
    //<validation>
    if (!util.isNumber(pixelY)) throw new Error('CartesianCoords.getDataY(pixelY): pixelY must be a number.');
    //</validation>
    var py = pixelY - this._viewPort.y();
    var dataY = this._viewBox.yMin() + this.getDataDimensionY(this._viewPort.height() - py);
    return dataY;
};

/** 
 * Converts an x dimension from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelDimensionX An x dimension (pixel units).
 *
 * @return {number} An x dimension (data units).
 */
CartesianCoords.prototype.getDataDimensionX = function (pixelDimensionX)
{
    //<validation>
    if (!util.isNumber(pixelDimensionX)) throw new Error('CartesianCoords.getDataDimensionX(pixelDimensionX): pixelDimensionX must be a number.');
    //</validation>
    if (pixelDimensionX === 0) return 0;
    var dataDimensionX = (pixelDimensionX / this._viewPort.width()) * this._viewBox.width();
    return dataDimensionX;
};

/** 
 * Converts a y dimension from pixel units to data units.
 * 
 * @since 0.1.0
 *
 * @param {number} pixelDimensionY A y dimension (pixel units).
 *
 * @return {number} A y dimension (data units).
 */
CartesianCoords.prototype.getDataDimensionY = function (pixelDimensionY)
{
    //<validation>
    if (!util.isNumber(pixelDimensionY)) throw new Error('CartesianCoords.getDataDimensionY(pixelDimensionY): pixelDimensionY must be a number.');
    //</validation>
    if (pixelDimensionY === 0) return 0;
    var dataDimensionY = (pixelDimensionY / this._viewPort.height()) * this._viewBox.height();
    return dataDimensionY;
};

/** 
 * Adjusts a bounding box to fit a rectangle in order to maintain the aspect ratio.
 * 
 * @since 0.1.0
 * @private
 *
 * @param {ViewBox} viewBox A bounding box.
 *
 * @param {Rectangle} rect A rectangle.
 */
CartesianCoords.prototype.fitViewBoxToViewPort = function (viewBox, rect)
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

module.exports = CartesianCoords;