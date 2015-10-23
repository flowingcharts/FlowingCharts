/*! flowingcharts v0.1.0 2015-10-23 */
var flowingcharts = (function (fc)
{
	'use strict';
	var canvas = fc.canvas = fc.canvas || {};

	/** 
	 * Check if canvas is supported.
	 * @method isSupported
	 */
	canvas.isSupported = function ()
	{
        return !!document.createElement('canvas').getContext;
	};

	return fc;
}) (flowingcharts || {});
var flowingcharts = (function (fc)
{
	'use strict';
	var geom = fc.geom = fc.geom || {};

	/** 
	 * @classdesc An area defined by its position, as indicated 
	 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
	 * and by its top-right corner point (<code>xMax</code>, <code>yMax</code>).
	 * 
	 * @alias flowingcharts.geom.BoundingBox
	 * @since 0.1.0
	 * @author J Clare
	 * @constructor
	 * @param {Number} [xMin=0] The x-coord of the bottom-left corner.
	 * @param {Number} [yMin=0] The y-coord of the bottom-left corner. 
	 * @param {Number} [xMax=100] The x-coord of the top-right corner. 
	 * @param {Number} [yMax=100] The y-coord of the top-right corner. 
	 */
	geom.BoundingBox = function (xMin, yMin, xMax, yMax)
	{
		this.xMin(xMin || 0);
		this.yMin(yMin || 0);
		this.xMax(xMax || 100);
		this.yMax(yMax || 100);
	};

	geom.BoundingBox.prototype = 
	{
		/** 
		 * Get or set the x-coord of the left edge of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} x The coordinate.
		 * @return {Number} The coordinate.
		 */
		xMin : function (x)
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
		 * Get or set the x-coord of the right edge of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} x The coordinate.
		 * @return {Number} The coordinate.
		 */
		xMax : function (x)
		{
			if (x !== undefined)
			{
				this._xMax = x;
				this._width = Math.abs(this._xMax - this._xMin);
				this._xCenter = this._xMin + (this._width / 2);
				return this;
			}
			else return this._xMax;
		},


		/** 
		 * Get or set the x-coord of the center of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} x The coordinate.
		 * @return {Number} The coordinate.
		 */
		xCenter : function (x)
		{
			if (x !== undefined)
			{
				this._xCenter = x;
				this._xMin  = this._xCenter - (this._width / 2);
				this._xMax  = this._xCenter + (this._width / 2);
				return this;
			}
			else return this._xCenter;
		},


		/** 
		 * Get or set the width of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} w The width.
		 * @return {Number} The width.
		 */
		width : function (w)
		{
			if (w !== undefined)
			{
				this._width = w;
				this._xMax = this._xMin + this._width;
				this._xCenter = this._xMin + (this._width / 2);
				return this;
			}
			else return this._width;
		},

		/** 
		 * Get or set the y-coord of the bottom edge of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} y The coordinate.
		 * @return {Number} The coordinate.
		 */
		yMin : function (y)
		{
			if (y !== undefined)
			{
				this._yMin = y;
				this._height = Math.abs(this._yMax - this._yMin);
				this._yCenter = this._yMin + (this._height / 2);
				return this;
			}
			else return this._yMin;
		},

		/** 
		 * Get or set the y-coord of the top edge of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} y The coordinate.
		 * @return {Number} The coordinate.
		 */
		yMax : function (y)
		{
			if (y !== undefined)
			{
				this._yMax = y;
				this._height = Math.abs(this._yMax - this._yMin);
				this._yCenter = this._yMin + (this._height / 2);
				return this;
			}
			else return this._yMax;
		},

		/** 
		 * Get or set the y-coord of the center of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} y The coordinate.
		 * @return {Number} The coordinate.
		 */
		yCenter : function (y)
		{
			if (y !== undefined)
			{
				this._yCenter = y;
				this._yMin  = this._yCenter - (this._height / 2);
				this._yMax  = this._yCenter + (this._height / 2);
				return this;
			}
			else return this._yCenter;
		},

		/** 
		 * Get or set the height of the bounding box.
		 *
		 * @since 0.1.0
		 * @param {Number} h The height.
		 * @return {Number} The height.
		 */
		height : function (h)
		{
			if (h !== undefined)
			{
				this._height = h;
				this._yMax = this._yMin + this._height;
				this._yCenter = this._yMin + (this._height / 2);
				return this;
			}
			else return this._yCenter;
		},

		/** 
		 * Gets a clone of this bounding box.		
		 * 
		 * @since 0.1.0
		 * @return {flowingcharts.geom.BoundingBox} The bounding box.	 
		 */
		clone : function ()
		{
			return new geom.BoundingBox(this._xMin, this._yMin, this._xMax, this._yMax);
		},

		/** 
		 * Tests whether a bounding box is equal to this one.
		 * 
		 * @since 0.1.0
		 * @param {flowingcharts.geom.BoundingBox} bBox The bounding box.
		 * @return {Boolean} true if bounding box is equal to this one, otherwise false.
		 */
		equals : function (bBox)
		{
			if (bBox.getXMin() !== this._xMin) return false;
			if (bBox.getYMin() !== this._yMin) return false;
			if (bBox.getXMax() !== this._xMax) return false;
			if (bBox.getYMax() !== this._yMax) return false;
			return true;
		},

		/** 
		 * Tests whether a bounding box intersects this one.
		 * 
		 * @since 0.1.0
		 * @param {flowingcharts.geom.BoundingBox} bBox The bounding box.
		 * @return {Boolean} true if bounding bounding boxes intercept, otherwise false.
		 */
		intersects : function (bBox)
		{
			if (bBox.getXMin() > this._xMax) return false;
			if (bBox.getXMax() < this._xMin) return false;
			if (bBox.getYMin() > this._yMax) return false;
			if (bBox.getYMax() < this._yMin) return false;
			return true;
		},

		/** 
		 * Tests whether a bounding box is contained within this one.
		 * 
		 * @since 0.1.0
		 * @param {flowingcharts.geom.BoundingBox} bBox The bounding box.
		 * @return {Boolean} true if bounding box is contained within this one, otherwise false.
		 */
		contains : function (bBox)
		{
			if (bBox.getXMin() < this._xMin) return false;
			if (bBox.getXMax() > this._xMax) return false;
			if (bBox.getYMin() < this._yMin) return false;
			if (bBox.getYMax() > this._yMax) return false;
			return true;
		},
	};

	return fc;
}) (flowingcharts || {});
var flowingcharts = (function (fc)
{
	'use strict';
	var geom = fc.geom = fc.geom || {};

	/** 
	 * Maps a data space to a pixel space and vice versa.
	 * 
	 * <p>The data space is defined by a {@link flowingcharts.geom.BoundingBox}.</p>
	 *
	 * <p>The pixel space is defined by the <a href="#canvasX">canvasX</a>, <a href="#canvasY">canvasY</a>, 
	 * <a href="#canvasWidth">canvasWidth</a> and <a href="#canvasHeight">canvasHeight</a> properties.</p>
	 * 
	 * <p>Pixel coords are relative to the top left corner of the view. 
	 * Data coords are relative to the bottom left corner of the view.</p>
	 *
	 * <p>The data space may be adjusted to maintain its aspect ratio by setting 
	 * the value of <a href="#maintainAspectRatio">maintainAspectRatio</a> to true.</p>
	 *
	 * @author J Clare
	 * @constructor
	 * @param {Number} [canvasX=0] The x-coord of the pixel space.
	 * @param {Number} [canvasY=0] The y-coord of the pixel space.
	 * @param {Number} [canvasWidth=0] The width of the pixel space.
	 * @param {Number} [canvasHeight=0] The height of the pixel space.
	 */
	geom.CartesianSpace = function (canvasX, canvasY, canvasWidth, canvasHeight)
	{
		this.canvasX = canvasX || 0;
		this.canvasY = canvasY || 0;
		this.canvasWidth = canvasWidth || 0;
		this.canvasHeight = canvasHeight || 0;
		this.bBox = new flowingcharts.geom.BoundingBox();
		this.oldBBox = new flowingcharts.geom.BoundingBox();
		this._oldBBoxSet = false;
		this.minZoom = -1;
		this.maxZoom = -1;
		this.maintainAspectRatio = false;
	};

	geom.CartesianSpace.prototype = 
	{
		/** 
		 * The pixel x-position.
		 *
		 * @type Number
		 * @default 0
		 */
		canvasX : 0,

		/** 
		 * The pixel y-position.
		 *
		 * @type Number
		 * @default 0
		 */
		canvasY : 0,

		/** 
		 * The pixel width.
		 *
		 * @type Number
		 * @default 0
		 */
		canvasWidth : 0,

		/** 
		 * The pixel height.
		 *
		 * @type Number
		 * @default 0
		 */
		canvasHeight : 0,

		/** 
		 * The minimum extent.
		 *
		 * @type Number
		 * @default -1
		 */
		minZoom : -1,

		/** 
		 * The maximum extent.
		 *
		 * @type Number
		 * @default -1
		 */
		maxZoom : -1,

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
			var px = this.canvasX + this.getPixelWidth(x - this.bBox.getXMin());
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
			var py =  this.canvasY + this.canvasHeight - this.getPixelHeight(y - this.bBox.getYMin());
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
			var pixelDistance  = (dimension / this.bBox.getWidth()) * this.canvasWidth;
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
			var pixelDistance = (dimension / this.bBox.getHeight()) * this.canvasHeight;
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
			var dataY = this.bBox.getYMin() + this.getDataHeight(this.canvasHeight - y);
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
			var dataDistance = (dimension / this.canvasWidth) * this.bBox.getWidth();
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
			var dataDistance = (dimension / this.canvasHeight) * this.bBox.getHeight();
			return dataDistance;
		},

		/** 
		 * A call to <code>commitChanges</code> commits any changes made to
		 * <a href="#canvasWidth">canvasWidth</a>, <a href="#canvasHeight">canvasHeight</a> or <a href="#bBox">bBox</a>.
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
			var sy = bb.getHeight() / this.canvasHeight;
			var sx = bb.getWidth() / this.canvasWidth;

			var sBBoxX;
			var sBBoxY;
			var sBBoxW;
			var sBBoxH; 

			if (sy > sx)
			{
				sBBoxY = bb.getYMin();
				sBBoxH = bb.getHeight();
				sBBoxW = (this.canvasWidth / this.canvasHeight) * sBBoxH;
				sBBoxX = bb.getXMin() - ((sBBoxW - bb.getWidth()) / 2);
			}
			else if (sx > sy)
			{
				sBBoxX = bb.getXMin();
				sBBoxW = bb.getWidth();
				sBBoxH = (this.canvasHeight / this.canvasWidth) * sBBoxW;
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

	return fc;
}) (flowingcharts || {});
var flowingcharts = (function (fc, $)
{
    'use strict';
    var jquery = fc.jquery = fc.jquery || {};

	$.fn.flowingcharts = function (options) 
	{
        var settings = $.extend(
        {
            color 			: "#556b2f",
            backgroundColor	: "brown"
        }, options );

        this.css(  
        {
            color 			: settings.color,
            backgroundColor	: settings.backgroundColor
        });
        
        return this;
	};

	return fc;
}) (flowingcharts || {}, window.jQuery);
var flowingcharts = (function (fcharts)
{
   'use strict';
	var fc = fcharts = fcharts || {};


	var bb = new fc.geom.BoundingBox();
	console.log(bb);

	return fc;
}) (flowingcharts || {});