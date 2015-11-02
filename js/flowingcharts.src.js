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
 * @fileoverview Contains the BoundingBox class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/BoundingBox 
 */

/** 
 * @classdesc An area defined by its position, as indicated 
 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
 * and top-right corner point (<code>xMax</code>, <code>yMax</code>).
 * 
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [xMin = 0] The x coord of the left edge.
 * @param {number} [yMin = 0] The y coord of the bottom edge.
 * @param {number} [xMax = 100] The x coord of the right edge.
 * @param {number} [yMax = 100] The y coord of the top edge.
 */
function BoundingBox (xMin, yMin, xMax, yMax)
{
    xMin = xMin !== undefined ? xMin : 0;
    yMin = yMin !== undefined ? yMin : 0;
    xMax = xMax !== undefined ? xMax : 100;
    yMax = yMax !== undefined ? yMax : 100;
    this.setCoords({xMin:xMin, yMin:yMin, xMax:xMax, yMax:yMax});
}

BoundingBox.prototype = 
{
    // Private variables
    _xMin : null,      // The x-coord of the left edge.
    _xMax : null,      // The x-coord of the right edge.
    _xCenter : null,   // The x-coord of the center.
    _width : null,     // The width.
    _yMin : null,      // The y-coord of the bottom edge.
    _yMax : null,      // The y-coord of the right edge.
    _yCenter : null,   // The y-coord of the center.
    _height : null,    // The height.

    /** 
     * Set the coordinates.
     *
     * @since 0.1.0
     * @param {Object} coords The coordinates.
     * @param {number} [coords.xMin] The x coord of the left edge.
     * @param {number} [coords.yMin] The y coord of the bottom edge.
     * @param {number} [coords.xMax] The x coord of the right edge.
     * @param {number} [coords.yMax] The y coord of the top edge.
     * @return {BoundingBox} <code>this</code>.
     */
    setCoords : function (coords)
    {
        if (arguments.length > 0)
        {
            if (coords.xMin !== undefined) this.xMin(coords.xMin);
            if (coords.yMin !== undefined) this.yMin(coords.yMin);
            if (coords.xMax !== undefined) this.xMax(coords.xMax);
            if (coords.yMax !== undefined) this.yMax(coords.yMax);
        }
        return this;
    },

    /** 
     * Get or set the x-coord of the left edge.
     *
     * @since 0.1.0
     * @param {number} [x] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if x is not a number.
     */
    xMin : function (x)
    {
        if (arguments.length > 0)
        {
            if (typeof x !== 'number') throw 'BoundingBox.xMin(x): x must be a number.';
            this._xMin = x;
            this._width = Math.abs(this._xMax - this._xMin);
            this._xCenter = this._xMin + (this._width / 2); 
            return this;
        }
        else return this._xMin;
    },

    /** 
     * Get or set the x-coord of the right edge.
     *
     * @since 0.1.0
     * @param {number} [x] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if x is not a number.
     */
    xMax : function (x)
    {
        if (arguments.length > 0)
        {
            if (typeof x !== 'number') throw 'BoundingBox.xMax(x): x must be a number.';
            this._xMax = x;
            this._width = Math.abs(this._xMax - this._xMin);
            this._xCenter = this._xMin + (this._width / 2);
            return this;
        }
        else return this._xMax;
    },


    /** 
     * Get or set the x-coord of the center.
     *
     * @since 0.1.0
     * @param {number} [x] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if x is not a number.
     */
    xCenter : function (x)
    {
        if (arguments.length > 0)
        {
            if (typeof x !== 'number') throw 'BoundingBox.xCenter(x): x must be a number.';
            this._xCenter = x;
            this._xMin  = this._xCenter - (this._width / 2);
            this._xMax  = this._xCenter + (this._width / 2);
            return this;
        }
        else return this._xCenter;
    },


    /** 
     * Get or set the width.
     *
     * @since 0.1.0
     * @param {number} [w] The width.
     * @return {number|BoundingBox} The width if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if w is not a number.
     */
    width : function (w)
    {
        if (arguments.length > 0)
        {
            if (typeof w !== 'number') throw 'BoundingBox.width(w): w must be a number.';
            this._width = w;
            this._xMax = this._xMin + this._width;
            this._xCenter = this._xMin + (this._width / 2);
            return this;
        }
        else return this._width;
    },

    /** 
     * Get or set the y-coord of the bottom edge.
     *
     * @since 0.1.0
     * @param {number} [y] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if y is not a number.
     */
    yMin : function (y)
    {
        if (arguments.length > 0)
        {
            if (typeof y !== 'number') throw 'BoundingBox.yMin(y): y must be a number.';
            this._yMin = y;
            this._height = Math.abs(this._yMax - this._yMin);
            this._yCenter = this._yMin + (this._height / 2);
            return this;
        }
        else return this._yMin;
    },

    /** 
     * Get or set the y-coord of the top edge.
     *
     * @since 0.1.0
     * @param {number} [y] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if y is not a number.
     */
    yMax : function (y)
    {
        if (arguments.length > 0)
        {
            if (typeof y !== 'number') throw 'BoundingBox.yMax(y): y must be a number.';
            this._yMax = y;
            this._height = Math.abs(this._yMax - this._yMin);
            this._yCenter = this._yMin + (this._height / 2);
            return this;
        }
        else return this._yMax;
    },

    /** 
     * Get or set the y-coord of the center.
     *
     * @since 0.1.0
     * @param {number} [y] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if y is not a number.
     */
    yCenter : function (y)
    {
        if (arguments.length > 0)
        {
            if (typeof y !== 'number') throw 'BoundingBox.yCenter(y): y must be a number.';
            this._yCenter = y;
            this._yMin  = this._yCenter - (this._height / 2);
            this._yMax  = this._yCenter + (this._height / 2);
            return this;
        }
        else return this._yCenter;
    },

    /** 
     * Get or set the height.
     *
     * @since 0.1.0
     * @param {number} [h] The height.
     * @return {number|BoundingBox} The height if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if h is not a number.
     */
    height : function (h)
    {
        if (arguments.length > 0)
        {
            if (typeof h !== 'number') throw 'BoundingBox.yCenter(h): h must be a number.';
            this._height = h;
            this._yMax = this._yMin + this._height;
            this._yCenter = this._yMin + (this._height / 2);
            return this;
        }
        else return this._yCenter;
    },

    /** 
     * Returns a clone of this bounding box.        
     * 
     * @since 0.1.0
     * @return {BoundingBox} The bounding box.   
     */
    clone : function ()
    {
        return new BoundingBox(this._xMin, this._yMin, this._xMax, this._yMax);
    },

    /** 
     * Returns true if a bounding box equals to this one.
     * 
     * @since 0.1.0
     * @param {BoundingBox} bBox The bounding box.
     * @return {boolean} true, if the bounding box is equal to this one, otherwise false.
     * @throws {string} Will throw an error if bBox is undefined or is not a BoundingBox.
     */
    equals : function (bBox)
    {
        if (arguments.length > 0)
        {
            if (!(bBox instanceof BoundingBox)) throw 'BoundingBox.equals(bBox): bBox must be a BoundingBox.';
            if (bBox.getXMin() !== this._xMin) return false;
            if (bBox.getYMin() !== this._yMin) return false;
            if (bBox.getXMax() !== this._xMax) return false;
            if (bBox.getYMax() !== this._yMax) return false;
            return true;
        }
        else throw 'BoundingBox.equals(bBox): bBox has not been defined.';
    },

    /** 
     * Returns true if a bounding box intersects this one.
     * 
     * @since 0.1.0
     * @param {BoundingBox} bBox The bounding box.
     * @return {boolean} true, if the bounding box intercepts this one, otherwise false.
     * @throws {string} Will throw an error if bBox is undefined or is not a BoundingBox.
     */
    intersects : function (bBox)
    {
        if (arguments.length > 0)
        {
            if (!(bBox instanceof BoundingBox)) throw 'BoundingBox.intersects(bBox): bBox must be a BoundingBox.';
            if (bBox.getXMin() > this._xMax) return false;
            if (bBox.getXMax() < this._xMin) return false;
            if (bBox.getYMin() > this._yMax) return false;
            if (bBox.getYMax() < this._yMin) return false;
            return true;
        }
        else throw 'BoundingBox.intersects(bBox): bBox has not been defined.';
    },

    /** 
     * Returns true if a bounding box is contained within this one.
     * 
     * @since 0.1.0
     * @param {BoundingBox} bBox The bounding box.
     * @return {boolean} true, if bounding box is contained within this one, otherwise false.
     * @throws {string} Will throw an error if bBox is undefined or is not a BoundingBox.
     */
    contains : function (bBox)
    {
        if (arguments.length > 0)
        {
            if (!(bBox instanceof BoundingBox)) throw 'BoundingBox.contains(bBox): bBox must be a BoundingBox.';
            if (bBox.getXMin() < this._xMin) return false;
            if (bBox.getXMax() > this._xMax) return false;
            if (bBox.getYMin() < this._yMin) return false;
            if (bBox.getYMax() > this._yMax) return false;
            return true;
        }
        else throw 'BoundingBox.contains(bBox): bBox has not been defined.';
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
flowingcharts.BoundingBox = require('./geom/BoundingBox');
flowingcharts.canvas = require('./canvas/util');
require('./plugins/jqueryplugin');

// Replace/Create the global namespace
window.flowingcharts = flowingcharts;

var bb = new flowingcharts.BoundingBox();
window.console.log(bb);
var bb2 = new flowingcharts.BoundingBox("bah",567,867,2345);
window.console.log(bb2);
var t = bb.intersects("test")
},{"./canvas/util":1,"./geom/BoundingBox":2,"./plugins/jqueryplugin":4}],4:[function(require,module,exports){
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
