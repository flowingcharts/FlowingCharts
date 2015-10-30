/* jshint browserify: true */
'use strict';

var BoundingBox = require('BoundingBox.js');

/** 
 * @classdesc Maps a data space to a pixel space and vice versa.
 * 
 * <p>The data space is defined by a {@link flowingcharts.geom.BoundingBox}.</p>
 *
 * <p>The pixel space is defined by the <a href="#pixelX">pixelX</a>, <a href="#pixelY">pixelY</a>, 
 * <a href="#pixelWidth">pixelWidth</a> and <a href="#pixelHeight">pixelHeight</a> properties.</p>
 * 
 * <p>Pixel coords are relative to the top left corner of the view. 
 * Data coords are relative to the bottom left corner of the view.</p>
 *
 * <p>The data space may be adjusted to maintain its aspect ratio by setting 
 * the value of <a href="#maintainAspectRatio">maintainAspectRatio</a> to true.</p>
 *
 * @since 0.1.0
 * @author J Clare
 * @constructor
 * @param {BoundingBox} The bounding box.
 * @param {Number} [pixelX=0] The x coord of the top-left corner.
 * @param {Number} [pixelY=0] The y coord of the top-left corner.
 * @param {Number} [pixelWidth=100] The width.
 * @param {Number} [pixelHeight=100] The height.
 */
function CartesianSpace (pixelX, pixelY, pixelWidth, pixelHeight)
{

          if (x < 0 || y < 0 || y >= image.height || x >= image.width) {
            throw "x and y must be non-negative and less than the dimensions of the image";
	
	pixelX = pixelX === undefined ? 0 : pixelX;
	pixelY = pixelY === undefined ? 0 : pixelY;
	pixelWidth = pixelWidth === undefined ? 100 : pixelWidth;
	pixelHeight = pixelHeight === undefined ? 100 : pixelHeight;

	this.pixelX(pixelX);
	this.pixelY(pixelY);
	this.pixelWidth(pixelWidth);
	this.pixelHeight(pixelHeight);

	this.bBox = new BoundingBox();
	this.oldBBox = new BoundingBox();
	this._oldBBoxSet = false;
	this.minZoom = -1;
	this.maxZoom = -1;
	this.maintainAspectRatio = false;
}

CartesianSpace.prototype = 
{
	/** 
	 * Get or set the x-coord of the left edge of the bounding box.
	 *
	 * @since 0.1.0
	 * @param {Number} x The coordinate.
	 * @return {Number} The coordinate.
	 */
	pixelX : function (x)
	{
		if (x !== undefined)
		{
			this._xMin = x;
			this._width = Math.abs(this._xMax - this._xMin);
			this._xCenter = this._xMin + (this._width / 2); 
			return this;
		}
		else return this._xMin;
	},


	/** 
	 * The pixel x-position.
	 *
	 * @type Number
	 * @default 0
	 */
	pixelX : 0,

	/** 
	 * The pixel y-position.
	 *
	 * @type Number
	 * @default 0
	 */
	pixelY : 0,

	/** 
	 * The pixel width.
	 *
	 * @type Number
	 * @default 0
	 */
	pixelWidth : 0,

	/** 
	 * The pixel height.
	 *
	 * @type Number
	 * @default 0
	 */
	pixelHeight : 0,

	/** 
	 * The data space will often be a different shape to the 
	 * pixel space it has to fill. 
	 * 
	 * <p>If set to <code>true</code> the data space is
	 * adjusted to maintain the aspect ratio.</p>
	 * 
	 * <p>If set to <code>false</code> the data space stretches
	 * to fit the pixel space. This will generally result
	 * in the aspect ratio changing (a stretching effect).</p>
	 * 
	 * @type Boolean
	 * @default false
	 */
	maintainAspectRatio : false,

	/** 
	 * Gets the bounding box.
	 *
	 * @return {flowingcharts.geom.BoundingBox} The bounding box.
	 */
	getBBox : function ()
	{
		return this.bBox;
	},

	/** 
	 * Sets the bounding box.
	 * 
	 * @param {flowingcharts.geom.BoundingBox} bBox The bounding box.
	 */
	setBBox : function (bBox) 
	{
		if (!this._oldBBoxSet) 	this.oldBBox = bBox.clone();
		else 					this.oldBBox = this.bBox.clone();
		this.bBox = bBox.clone();
		this._oldBBoxSet = true;
		this.commitChanges();
	},

	/** 
	 * Converts a point from data units to pixel units.
	 * 
	 * @param {ia.Point} p A point (data units).
	 * @return {ia.Point} A point (pixel units).
	 */
	getPixelPoint : function (p)
	{
		return new ia.Point(this.getPixelX(p.x), this.getPixelY(p.y));
	},

	/** 
	 * Converts a bounding box (data units) to a rectangle (pixel units).
	 * 
	 * @param {flowingcharts.geom.BoundingBox} bb A bounding box (data units).
	 * @return {ia.Rectangle} A rectangle (pixel units).
	 */
	getPixelRect : function (bb)
	{
		var pixelRect = new ia.Rectangle(this.getPixelX(bb.getXMin()),
						this.getPixelY(bb.getYMax()),
						this.getPixelWidth(bb.getWidth()),
						this.getPixelHeight(bb.getHeight()));
		return pixelRect;
	},

	/** 
	 * Converts an x-coord from data units to pixel units.
	 * 
	 * @param {Number} x An x-coord (data units).
	 * @return {Number} An x-coord (pixel units).
	 */
	getPixelX : function (x)
	{
		var px = this.pixelX + this.getPixelWidth(x - this.bBox.getXMin());
		//return Math.floor(px) + 0.5; // Remove antialiasing.
		return px;
	},

	/** 
	 * Converts a y-coord from data units to pixel units.
	 * 
	 * @param {Number} y A y-coord (data units).
	 * @return {Number} A y-coord (pixel units).
	 */
	getPixelY : function (y)
	{
		var py =  this.pixelY + this.pixelHeight - this.getPixelHeight(y - this.bBox.getYMin());
		//return Math.floor(py) + 0.5; // Remove antialiasing.
		return py;
	},

	/** 
	 * Converts a width from data units to pixel units.
	 * 
	 * @param {Number} x A width (data units).
	 * @return {Number} A width (pixel units).
	 */
	getPixelWidth : function (dimension)
	{
		if (dimension === 0) return 0;
		var pixelDistance  = (dimension / this.bBox.getWidth()) * this.pixelWidth;
		//return Math.floor(pixelDistance) + 0.5; // Remove antialiasing.
		return pixelDistance;
	},

	/** 
	 * Converts a height from data units to pixel units.
	 * 
	 * @param {Number} y A height (data units).
	 * @return {Number} A height (pixel units).
	 */
	getPixelHeight : function (dimension)
	{
		if (dimension === 0) return 0;
		var pixelDistance = (dimension / this.bBox.getHeight()) * this.pixelHeight;
		//return Math.floor(pixelDistance) + 0.5; // Remove antialiasing.
		return pixelDistance;
	},

	/** 
	 * Converts a point from pixel units to data units.
	 * 
	 * @param {ia.Point} p A point (pixel units).
	 * @return {ia.Point} A point (data units).
	 */
	getDataPoint : function (p)
	{
		var dataPoint = new ia.Point(this.getDataX(p.x),this.getDataY(p.y));
		return dataPoint;
	},

	/** 
	 * Converts a rectangle (pixel units) to a bBox (data units).
	 * 
	 * @param {ia.Rectangle} rect A rectangle (pixel units).
	 * @return {flowingcharts.geom.BoundingBox} A bBox (data units).
	 */
	getDataBBox : function (pixelRect)
	{
		var xMin = this.getPixelX(pixelRect.left());
		var yMin = this.getPixelY(pixelRect.bottom());
		var xMax = xMin + this.getPixelWidth(pixelRect.width);
		var yMax = yMin + this.getPixelHeight(pixelRect.height);

		var dataBBox = new flowingcharts.geom.BoundingBox(xMin, yMin, xMax, yMax);
		return dataBBox;
	},

	/** 
	 * Converts an x-coord from pixel units to data units.
	 * 
	 * @param {Number} x An x-coord (pixel units).
	 * @return {Number} An x-coord (data units).
	 */
	getDataX : function (x)
	{
		var dataX = this.bBox.getXMin() + this.getDataWidth(x);
		return dataX;
	},

	/** 
	 * Converts a y-coord from pixel units to data units.
	 * 
	 * @param {Number} y A y-coord (pixel units).
	 * @return {Number} A y-coord (data units).
	 */
	getDataY : function (y)
	{
		var dataY = this.bBox.getYMin() + this.getDataHeight(this.pixelHeight - y);
		return dataY;
	},

	/** 
	 * Converts a width from pixel units to data units.
	 * 
	 * @param {Number} dimension A width (pixel units).
	 * @return {Number} A width (data units).
	 */
	getDataWidth : function (dimension)
	{
		if (dimension === 0) return 0;
		var dataDistance = (dimension / this.pixelWidth) * this.bBox.getWidth();
		return dataDistance;
	},

	/** 
	 * Converts a height from pixel units to data units.
	 * 
	 * @param {Number} dimension A height (pixel units).
	 * @return {Number} A height (data units).
	 */
	getDataHeight : function (dimension)
	{
		if (dimension === 0)return 0;
		var dataDistance = (dimension / this.pixelHeight) * this.bBox.getHeight();
		return dataDistance;
	},

	/** 
	 * A call to <code>commitChanges</code> commits any changes made to
	 * <a href="#pixelWidth">pixelWidth</a>, <a href="#pixelHeight">pixelHeight</a> or <a href="#bBox">bBox</a>.
	 * 
	 * <p>This function exists to allow properties to be changed  
	 * without continuous updates to the object.</p>
	 */
	commitChanges : function ()
	{
		if (this.maintainAspectRatio) this.adjustBBox(this.bBox);
			
		var withinExtents = true;
		if (this.minZoom != -1)
		{
			var minZoom = Math.max(this.bBox.getWidth(), this.bBox.getHeight());
			if (minZoom > this.minZoom) withinExtents = false;
		}
		if (this.maxZoom != -1)
		{
			var maxZoom = Math.min(this.bBox.getWidth(), this.bBox.getHeight());
			if (maxZoom < this.maxZoom) withinExtents = false;
		}
		
		if (withinExtents)
		{
			// Test against rounded pixels - due to problems with 
			// precision in real world coords.
			var oldRect = this.getPixelRect(this.oldBBox);
			var newRect = this.getPixelRect(this.bBox);
			var w = Math.round(newRect.width);
			var h = Math.round(newRect.height);
			var ow = Math.round(oldRect.width);
			var oh = Math.round(oldRect.height);

			if((w === ow) && (h === oh))
			{
				// Pan.
				eventType = ia.BBoxEvent.BBOX_TRANSLATE;
			}
			else
			{
				// Zoom.
				eventType = ia.BBoxEvent.BBOX_SCALE;
			}
		}
		else 
		{
			this.bBox = this.oldBBox.clone();
			if (this.maintainAspectRatio) this.adjustBBox(this.bBox);
			eventType = ia.BBoxEvent.BBOX_SCALE;
		}
	},

	/** 
	 * Adjusts the bounding box to fit the pixel space whilst maintaining its aspect ratio.
	 * 
	 * @param {flowingcharts.geom.BoundingBox} bb The bounding box.
	 */
	adjustBBox : function (bb)
	{
		var sy = bb.getHeight() / this.pixelHeight;
		var sx = bb.getWidth() / this.pixelWidth;

		var sBBoxX;
		var sBBoxY;
		var sBBoxW;
		var sBBoxH; 

		if (sy > sx)
		{
			sBBoxY = bb.getYMin();
			sBBoxH = bb.getHeight();
			sBBoxW = (this.pixelWidth / this.pixelHeight) * sBBoxH;
			sBBoxX = bb.getXMin() - ((sBBoxW - bb.getWidth()) / 2);
		}
		else if (sx > sy)
		{
			sBBoxX = bb.getXMin();
			sBBoxW = bb.getWidth();
			sBBoxH = (this.pixelHeight / this.pixelWidth) * sBBoxW;
			sBBoxY = bb.getYMin() - ((sBBoxH - bb.getHeight()) / 2);
		}
		else
		{
			sBBoxX = bb.getXMin();
			sBBoxY = bb.getYMin();
			sBBoxW = bb.getWidth();
			sBBoxH = bb.getHeight();
		}

		bb.setXMin(sBBoxX);
		bb.setYMin(sBBoxY);
		bb.setWidth(sBBoxW);
		bb.setHeight(sBBoxH);
	},
};

module.exports = CartesianSpace;