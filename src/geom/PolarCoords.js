/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link PolarCoords} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/PolarCoords 
 * @requires utils/util
 * @requires geom/ViewBox
 * @requires geom/Rectangle
 * @requires geom/Point
 */

// Required modules.
var ViewBox     = require('./ViewBox');
var Rectangle   = require('./Rectangle');
var Point       = require('./Point');
var util        = require('../utils/util');
var isNumber    = util.isNumber;

/** 
 * @classdesc Maps a data space to a pixel space and vice versa.
 *
 * @class
 * @alias PolarCoords
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function PolarCoords ()
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
 * @param {number} [x = 0] The x coord of the top left corner.
 * @param {number} [y = 0] The y coord of the top left corner.
 * @param {number} [width = 100] The width.
 * @param {number} [height = 100] The height.
 * @return {Rectangle|PolarCoords} A Rectangle that defineds the viewPort if no arguments are supplied, otherwise <code>this</code>.
 */
PolarCoords.prototype.viewPort = function (x, y, width, height)
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
 * @param {number} [xMin = 0] The x coord of the bottom left corner.
 * @param {number} [yMin = 0] The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 * @return {ViewBox|PolarCoords} The ViewBox if no arguments are supplied, otherwise <code>this</code>.
 */
PolarCoords.prototype.viewBox = function (xMin, yMin, xMax, yMax)
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
 * @param {Point} dataPoint A point (data units).
 * @return {Point} A point (pixel units).
 */
PolarCoords.prototype.getPixelPoint = function (dataPoint)
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
PolarCoords.prototype.getPixelRect = function (viewBox)
{
    var x = this.getPixelX(viewBox.xMin());
    var y = this.getPixelY(viewBox.yMax());
    var w = this.getPixelWidth(viewBox.width());
    var h = this.getPixelHeight(viewBox.height());
    return new Rectangle(x, y, w, h);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number[]} arrData An array of coords (data units).
 * @return {number[]} An array of coords (pixel units).
 */
PolarCoords.prototype.getPixelArray = function (arrData)
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
 * @param {number} dataX An x coord (data units).
 * @return {number} The x coord (pixel units).
 */
PolarCoords.prototype.getPixelX = function (dataX)
{
    //<validation>
    if (!isNumber(dataX)) throw new Error('CartesianCoords.getPixelX(dataX): dataX must be a number.');
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
PolarCoords.prototype.getPixelY = function (dataY)
{
    //<validation>
    if (!isNumber(dataY)) throw new Error('CartesianCoords.getPixelY(dataY): dataY must be a number.');
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
PolarCoords.prototype.getPixelWidth = function (dataWidth)
{
    //<validation>
    if (!isNumber(dataWidth)) throw new Error('CartesianCoords.getPixelWidth(dataHeight): dataWidth must be a number.');
    if (dataWidth < 0)        throw new Error('CartesianCoords.getPixelWidth(dataHeight): dataWidth must be >= 0.');
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
PolarCoords.prototype.getPixelHeight = function (dataHeight)
{
    //<validation>
    if (!isNumber(dataHeight)) throw new Error('CartesianCoords.getPixelHeight(dataHeight): dataHeight must be a number.');
    if (dataHeight < 0)        throw new Error('CartesianCoords.getPixelHeight(dataHeight): dataHeight must be >= 0.');
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
PolarCoords.prototype.getDataPoint = function (pixelPoint)
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
PolarCoords.prototype.getDataCoords = function (pixelCoords)
{
    var xMin = this.getDataX(pixelCoords.x());
    var yMax = this.getDataY(pixelCoords.y());
    var xMax = xMin + this.getDataWidth(pixelCoords.width());
    var yMin = yMax - this.getPDataHeight(pixelCoords.height());
    return new ViewBox(xMin, yMin, xMax, yMax);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] from pixel units to data units.
 * 
 * @since 0.1.0
 * @param {number[]} arrPixel An array of coords (pixel units).
 * @return {number[]} An array of coords (data units).
 */
PolarCoords.prototype.getDataArray = function (arrPixel)
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
 * @param {number} pixelX An x coord (pixel units).
 * @return {number} An x coord (data units).
 */
PolarCoords.prototype.getDataX = function (pixelX)
{
    //<validation>
    if (!isNumber(pixelX)) throw new Error('PolarCoords.getDataX(pixelX): pixelX must be a number.');
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
PolarCoords.prototype.getDataY = function (pixelY)
{
    //<validation>
    if (!isNumber(pixelY)) throw new Error('PolarCoords.getDataY(pixelY): pixelY must be a number.');
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
PolarCoords.prototype.getDataWidth = function (pixelWidth)
{
    //<validation>
    if (!isNumber(pixelWidth)) throw new Error('PolarCoords.getDataWidth(pixelWidth): pixelWidth must be a number.');
    if (pixelWidth < 0)        throw new Error('PolarCoords.getDataWidth(pixelWidth): pixelWidth must be >= 0.');
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
PolarCoords.prototype.getDataHeight = function (pixelHeight)
{
    //<validation>
    if (!isNumber(pixelHeight)) throw new Error('PolarCoords.getDataHeight(pixelHeight): pixelHeight must be a number.');
    if (pixelHeight < 0)        throw new Error('PolarCoords.getDataHeight(pixelHeight): pixelHeight must be >= 0.');
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
PolarCoords.prototype.fitViewBoxToViewPort = function (viewBox, rect)
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

module.exports = PolarCoords;