/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the CartesianChart class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/CartesianChart 
 */

// Required modules.
var BoundingBox = require('./BoundingBox');
var Rectangle = require('./Rectangle');
var Point = require('./Point');
var CanvasRenderer = require('../renderers/CanvasRenderer');
var util = require('../util');
var extendObject = util.extendObject;

/** 
 * @classdesc Maps data coords to pixel coords and vice versa.
 *
 * <p>The pixel coords are defined by a rectangle {@link pixelCoords}.
 * Pixel coords are relative to the top left corner of the chart.</p>
 *
 * <p>The data coords are defined by a bounding box {@link dataCoords}.
 * Data coords are relative to the bottom left corner of the chart.</p>
 * 
 * <p>The data coords may be adjusted to maintain the aspect ratio by setting 
 * the value of {@link maintainAspectRatio} to true.</p>
 *
 * @since 0.1.0
 * @author J Clare
 * @constructor
 *
 * @requires geom/BoundingBox
 * @requires geom/Rectangle
 * @requires geom/Point
 * @requires renderers/CanvasRenderer
 * @requires util.extendObject
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
function CartesianChart (options)
{
    options = options !== undefined ? options : {};

    // Default options.
    var o =
    {
        chart :
        {

        },
        xAxis :
        {

        },
        yAxis :
        {

        }
    };
    o = extendObject(o, options);

    this._rect = new Rectangle(o.chart.x, o.chart.y, o.chart.width, o.chart.height);
    this._bBox = new BoundingBox(o.xAxis.min, o.yAxis.min, o.xAxis.max, o.yAxis.max);

    // TODO options.container can be id or element - test for string.
    this._renderer = new CanvasRenderer(
    {
        container : o.container,
        onResize : function (w, h)
        {
            this._rect.setCoords(0, 0, w, h);
            this.render();
        }
        .bind(this)
    });
}

CartesianChart.prototype = 
{
    // Private variables.
    _rect : null, // The rectangle defining the pixel coords.
    _bBox : null, // The bounding box defining the data coords.

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
    maintainAspectRatio : false,

    render : function()
    {
        this._renderer.clear();

        var w = this._rect.width();
        var h = this._rect.height();

        for (var i = 0; i < 5; i++)
        {
            this._renderer.rect(Math.random()*w, 
                Math.random()*h, 
                Math.random()*50, 
                Math.random()*50).fill({color:'#f5f5f5'}).stroke({color:'#cccccc'});

            this._renderer.circle(Math.random()*w, 
                Math.random()*h, 
                Math.random()*50).fillColor('#ff0000').fill().stroke();

            this._renderer.circle(Math.random()*w, 
                Math.random()*h, 
                Math.random()*50).fill({color:'#ccf5f5'}).stroke({color:'#ccccff', width:5});

            this._renderer.lineColor('#0000ff').lineWidth(10).rect(Math.random()*w, 
                Math.random()*h, 
                Math.random()*50, 
                Math.random()*50).fillColor('#ff00ff').stroke().fill();

            this._renderer.lineWidth(10).circle(Math.random()*w, 
                Math.random()*h, 
                Math.random()*50).stroke().fill();
        }
    },

    /** 
     * Get or set the data coords.
     *
     * @since 0.1.0
     * @param {number} [xMin] The x coord of the bottom left corner.
     * @param {number} [yMin] The y coord of the bottom left corner.
     * @param {number} [xMax] The x coord of the top right corner.
     * @param {number} [yMax] The y coord of the top right corner.
     * @return {BoundingBox|CartesianChart} The data coords as a BoundingBox if no arguments are supplied, otherwise <code>this</code>.
     */
    dataCoords : function (xMin, yMin, xMax, yMax)
    {
        if (arguments.length > 0)
        {
            this._bBox.setCoords(xMin, yMin, xMax, yMax);
            if (this.maintainAspectRatio) fitBBoxToRect(this._bBox, this._rect);
            return this;
        }
        return this._bBox.clone();
    },

    /** 
     * Get or set the pixel coords.
     *
     * @since 0.1.0
     * @param {number} [x] The x-coord of the top left corner.
     * @param {number} [y] The y coord of the top left corner.
     * @param {number} [w] The width.
     * @param {number} [h] The height.
     * @return {Rectangle|CartesianChart} The pixel coords as a Rectangle if no arguments are supplied, otherwise <code>this</code>.
     */
    pixelCoords : function (x, y, w, h)
    {
        if (arguments.length > 0)
        {
            this._rect.setCoords(x, y, w, h);
            if (this.maintainAspectRatio) fitBBoxToRect(this._bBox, this._rect);
            return this;
        }
        return this._rect.clone();
    },

    /** 
     * Converts a point from data units to pixel units.
     * 
     * @param {Point} dataPoint A point (data units).
     * @return {Point} A point (pixel units).
     */
    getPixelPoint : function (dataPoint)
    {
        var x = this.getPixelX(dataPoint.x());
        var y = this.getPixelY(dataPoint.y());
        return new Point(x, y);
    },

    /** 
     * Converts a bounding box (data units) to a rectangle (pixel units).
     * 
     * @param {BoundingBox} bBox A bounding box (data units).
     * @return {Rectangle} A rectangle (pixel units).
     */
    getPixelRect : function (bBox)
    {
        var x = this.getPixelX(bBox.xMin());
        var y = this.getPixelY(bBox.yMax());
        var w = this.getPixelWidth(bBox.width());
        var h = this.getPixelHeight(bBox.height());
        return new Rectangle(x, y, w, h);
    },

    /** 
     * Converts an x-coord from data units to pixel units.
     * 
     * @param {number} dataX An x-coord (data units).
     * @return {number} The x-coord (pixel units).
     */
    getPixelX : function (dataX)
    {
        var px = this._rect.x() + this.getPixelWidth(dataX - this.bBox.xMin());
        return px;
    },

    /** 
     * Converts a y-coord from data units to pixel units.
     * 
     * @param {number} dataY A y-coord (data units).
     * @return {number} The y-coord (pixel units).
     */
    getPixelY : function (dataY)
    {
        var py =  this._rect.y() + this._rect.height() - this.getPixelHeight(dataY - this.bBox.yMin());
        return py;
    },

    /** 
     * Converts a width from data units to pixel units.
     * 
     * @param {number} dataWidth A width (data units).
     * @return {number} The width (pixel units).
     */
    getPixelWidth : function (dataWidth)
    {
        if (dataWidth === 0) return 0;
        var pixelDistance  = (dataWidth / this.bBox.width()) * this._rect.width();
        return pixelDistance;
    },

    /** 
     * Converts a height from data units to pixel units.
     * 
     * @param {number} dataHeight A height (data units).
     * @return {number} The height (pixel units).
     */
    getPixelHeight : function (dataHeight)
    {
        if (dataHeight === 0) return 0;
        var pixelDistance = (dataHeight / this.bBox.height()) * this._rect.height();
        return pixelDistance;
    },

    /** 
     * Converts a point from pixel units to data units.
     * 
     * @param {Point} pixelPoint A point (pixel units).
     * @return {Point} A point (data units).
     */
    getDataPoint : function (pixelPoint)
    {
        var x = this.getDataX(pixelPoint.x());
        var y = this.getDataY(pixelPoint.y());
        return new Point(x, y);
    },

    /** 
     * Converts a rectangle (pixel units) to a bBox (data units).
     * 
     * @param {Rectangle} pixelCoords A rectangle (pixel units).
     * @return {BoundingBox} A bBox (data units).
     */
    getDataCoords : function (pixelCoords)
    {
        var xMin = this.getPixelX(pixelCoords.x());
        var yMax = this.getPixelY(pixelCoords.y());
        var xMax = xMin + this.getPixelWidth(pixelCoords.width());
        var yMin = yMax - this.getPixelHeight(pixelCoords.height());
        return new BoundingBox(xMin, yMin, xMax, yMax);
    },

    /** 
     * Converts an x-coord from pixel units to data units.
     * 
     * @param {number} pixelX An x-coord (pixel units).
     * @return {number} An x-coord (data units).
     */
    getDataX : function (pixelX)
    {
        var dataX = this.bBox.xMin() + this.getDataWidth(pixelX);
        return dataX;
    },

    /** 
     * Converts a y-coord from pixel units to data units.
     * 
     * @param {number} pixelY A y-coord (pixel units).
     * @return {number} A y-coord (data units).
     */
    getDataY : function (pixelY)
    {
        var dataY = this.bBox.yMin() + this.getDataHeight(this._rect.height() - pixelY);
        return dataY;
    },

    /** 
     * Converts a width from pixel units to data units.
     * 
     * @param {number} pixelWidth A width (pixel units).
     * @return {number} A width (data units).
     */
    getDataWidth : function (pixelWidth)
    {
        if (pixelWidth === 0) return 0;
        var dataDistance = (pixelWidth / this._rect.width()) * this.bBox.width();
        return dataDistance;
    },

    /** 
     * Converts a height from pixel units to data units.
     * 
     * @param {number} pixelHeight A height (pixel units).
     * @return {number} A height (data units).
     */
    getDataHeight : function (pixelHeight)
    {
        if (pixelHeight === 0) return 0;
        var dataDistance = (pixelHeight / this._rect.height()) * this.bBox.height();
        return dataDistance;
    }
};

module.exports = CartesianChart;

/** 
 * Adjusts a boundnig box to fit a rectangle in order to maintain the aspect ratio.
 *
 * @private
 * @param {BoundingBox} bBox The bounding box.
 * @param {Rectangle} rect The rectangle.
 */
function fitBBoxToRect (bBox, rect)
{
    var sy = bBox.height() / rect.height();
    var sx = bBox.height() / rect.width();

    var sBBoxX, sBBoxY, sBBoxW, sBBoxH; 

    if (sy > sx)
    {
        sBBoxY = bBox.yMin();
        sBBoxH = bBox.height();
        sBBoxW = (rect.width() / rect.height()) * sBBoxH;
        sBBoxX = bBox.xMin() - ((sBBoxW - bBox.width()) / 2);
    }
    else if (sx > sy)
    {
        sBBoxX = bBox.xMin();
        sBBoxW = bBox.width();
        sBBoxH = (rect.height() / rect.width()) * sBBoxW;
        sBBoxY = bBox.yMin() - ((sBBoxH - bBox.height()) / 2);
    }
    else
    {
        sBBoxX = bBox.xMin();
        sBBoxY = bBox.yMin();
        sBBoxW = bBox.width();
        sBBoxH = bBox.height();
    }

    bBox.xMin(sBBoxX).yMin(sBBoxY).width(sBBoxW).height(sBBoxH);
}