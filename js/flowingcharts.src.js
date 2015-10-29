(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

/** 
 * @classdesc An area defined by its position, as indicated 
 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
 * and by its top-right corner point (<code>xMax</code>, <code>yMax</code>).
 * 
 * @since 0.1.0
 * @author J Clare
 * @constructor
 * @param {Number} [xMin=0] The x-coord of the bottom-left corner.
 * @param {Number} [yMin=0] The y-coord of the bottom-left corner. 
 * @param {Number} [xMax=100] The x-coord of the top-right corner. 
 * @param {Number} [yMax=100] The y-coord of the top-right corner. 
 */
function BoundingBox (xMin, yMin, xMax, yMax)
{
	this.xMin(xMin || 0);
	this.yMin(yMin || 0);
	this.xMax(xMax || 100);
	this.yMax(yMax || 100);
}

BoundingBox.prototype = 
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
	 * @return {BoundingBox} The bounding box.	 
	 */
	clone : function ()
	{
		return new BoundingBox(this._xMin, this._yMin, this._xMax, this._yMax);
	},

	/** 
	 * Tests whether a bounding box is equal to this one.
	 * 
	 * @since 0.1.0
	 * @param {BoundingBox} bBox The bounding box.
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
	 * @param {BoundingBox} bBox The bounding box.
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
	 * @param {BoundingBox} bBox The bounding box.
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

module.exports = BoundingBox;
},{}],3:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

// Grab an existing namespace object, or create a blank object if it doesn't exist.
var flowingcharts = window.flowingcharts || {};

// Add the modules.
// Only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly.
flowingcharts.BoundingBox = require('./geom/BoundingBox.js');
flowingcharts.canvas = require('./canvas/util.js');
require('./plugins/jqueryplugin.js');

// Replace/Create the global namespace
window.flowingcharts = flowingcharts;

var bb = new flowingcharts.BoundingBox();
window.console.log(bb);
var bb2 = new flowingcharts.BoundingBox(34,567,867,2345);
window.console.log(bb2);
},{"./canvas/util.js":1,"./geom/BoundingBox.js":2,"./plugins/jqueryplugin.js":4}],4:[function(require,module,exports){
(function (global){
/* jshint browserify: true */
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3]);
