/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Exports the {@link BoundingBox} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/BoundingBox 
 * @requires util
 */

// Required modules.
var util = require('../util');
var isNumber = util.isNumber;

/** 
 * @classdesc An area defined by its position, as indicated 
 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
 * and top-right corner point (<code>xMax</code>, <code>yMax</code>).
 * 
 * @class
 * @alias BoundingBox
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [xMin = 0] The x coord of the bottom left corner.
 * @param {number} [yMin = 0] The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 */
function BoundingBox (xMin, yMin, xMax, yMax)
{
    xMin = xMin !== undefined ? xMin : 0;
    yMin = yMin !== undefined ? yMin : 0;
    xMax = xMax !== undefined ? xMax : 100;
    yMax = yMax !== undefined ? yMax : 100;
    this.setCoords(xMin, yMin, xMax, yMax);
}

BoundingBox.prototype = 
{
    // Private variables.
    _xMin       : null,     // The x-coord of the bottom left corner.
    _xMax       : null,     // The x-coord of the top right corner.
    _xCenter    : null,     // The x-coord of the center.
    _width      : null,     // The width.
    _yMin       : null,     // The y-coord of the bottom left corner.
    _yMax       : null,     // The y-coord of the top right corner.
    _yCenter    : null,     // The y-coord of the center.
    _height     : null,     // The height.

    /** 
     * Set the coordinates.
     *
     * @since 0.1.0
     * @param {number} [xMin] The x coord of the bottom left corner.
     * @param {number} [yMin] The y coord of the bottom left corner.
     * @param {number} [xMax] The x coord of the top right corner.
     * @param {number} [yMax] The y coord of the top right corner.
     * @return {BoundingBox} <code>this</code>.
     */
    setCoords : function (xMin, yMin, xMax, yMax)
    {
        if (arguments.length > 0)
        {
            if (xMin !== undefined) this.xMin(xMin);
            if (yMin !== undefined) this.yMin(yMin);
            if (xMax !== undefined) this.xMax(xMax);
            if (yMax !== undefined) this.yMax(yMax);
        }
        return this;
    },

    /** 
     * Get or set the x-coord of the bottom left corner.
     *
     * @since 0.1.0
     * @param {number} [x] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Throws an error if x is not a number.
     */
    xMin : function (x)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(x)) throw new Error('BoundingBox.xMin(x): x must be a number.');

            this._xMin = x;
            this._width = Math.abs(this._xMax - this._xMin);
            this._xCenter = this._xMin + (this._width / 2); 
            return this;
        }
        else return this._xMin;
    },

    /** 
     * Get or set the x-coord of the top right corner.
     *
     * @since 0.1.0
     * @param {number} [x] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Throws an error if x is not a number.
     */
    xMax : function (x)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(x)) throw new Error('BoundingBox.xMax(x): x must be a number.');

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
     * @throws {Error} Throws an error if x is not a number.
     */
    xCenter : function (x)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(x)) throw new Error('BoundingBox.xCenter(x): x must be a number.');

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
     * @throws {Error} Throws an error if w is not a number or is less than 0.
     */
    width : function (w)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(w))  throw new Error('BoundingBox.width(w): w must be a number.');
            if (w < 0)         throw new Error('BoundingBox.width(w): w must be > 0.');

            this._width = w;
            this._xMax = this._xMin + this._width;
            this._xCenter = this._xMin + (this._width / 2);
            return this;
        }
        else return this._width;
    },

    /** 
     * Get or set the y-coord of the bottom left corner.
     *
     * @since 0.1.0
     * @param {number} [y] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Throws an error if y is not a number.
     */
    yMin : function (y)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(y)) throw new Error('BoundingBox.yMin(y): y must be a number.');

            this._yMin = y;
            this._height = Math.abs(this._yMax - this._yMin);
            this._yCenter = this._yMin + (this._height / 2);
            return this;
        }
        else return this._yMin;
    },

    /** 
     * Get or set the y-coord of the top right corner.
     *
     * @since 0.1.0
     * @param {number} [y] The coordinate.
     * @return {number|BoundingBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Throws an error if y is not a number.
     */
    yMax : function (y)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(y)) throw new Error('BoundingBox.yMax(y): y must be a number.');

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
     * @throws {Error} Throws an error if y is not a number.
     */
    yCenter : function (y)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(y)) throw new Error('BoundingBox.yCenter(y): y must be a number.');

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
     * @throws {Error} Throws an error if h is not a number or is less than 0.
     */
    height : function (h)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(h)) throw new Error('BoundingBox.height(h): h must be a number.');
            if (h < 0)        throw new Error('BoundingBox.height(h): h must be > 0.');

            this._height = h;
            this._yMax = this._yMin + this._height;
            this._yCenter = this._yMin + (this._height / 2);
            return this;
        }
        else return this._height;
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
     * @throws {Error} Throws an error if bBox is undefined or is not a BoundingBox.
     */
    equals : function (bBox)
    {
        if (arguments.length > 0)
        {
            if (!(bBox instanceof BoundingBox)) throw new Error('BoundingBox.equals(bBox): bBox must be a BoundingBox.');

            if (bBox.getXMin() !== this._xMin) return false;
            if (bBox.getYMin() !== this._yMin) return false;
            if (bBox.getXMax() !== this._xMax) return false;
            if (bBox.getYMax() !== this._yMax) return false;
            return true;
        }
        else throw new Error('BoundingBox.equals(bBox): bBox has not been defined.');
    },

    /** 
     * Returns true if a bounding box intersects this one.
     * 
     * @since 0.1.0
     * @param {BoundingBox} bBox The bounding box.
     * @return {boolean} true, if the bounding box intercepts this one, otherwise false.
     * @throws {Error} Throws an error if bBox is undefined or is not a BoundingBox.
     */
    intersects : function (bBox)
    {
        if (arguments.length > 0)
        {
            if (!(bBox instanceof BoundingBox)) throw new Error('BoundingBox.intersects(bBox): bBox must be a BoundingBox.');

            if (bBox.getXMin() > this._xMax) return false;
            if (bBox.getXMax() < this._xMin) return false;
            if (bBox.getYMin() > this._yMax) return false;
            if (bBox.getYMax() < this._yMin) return false;
            return true;
        }
        else throw new Error('BoundingBox.intersects(bBox): bBox has not been defined.');
    },

    /** 
     * Returns true if a bounding box is contained within this one.
     * 
     * @since 0.1.0
     * @param {BoundingBox} bBox The bounding box.
     * @return {boolean} true, if bounding box is contained within this one, otherwise false.
     * @throws {Error} Throws an error if bBox is undefined or is not a BoundingBox.
     */
    contains : function (bBox)
    {
        if (arguments.length > 0)
        {
            if (!(bBox instanceof BoundingBox)) throw new Error('BoundingBox.contains(bBox): bBox must be a BoundingBox.');

            if (bBox.getXMin() < this._xMin) return false;
            if (bBox.getXMax() > this._xMax) return false;
            if (bBox.getYMin() < this._yMin) return false;
            if (bBox.getYMax() > this._yMax) return false;
            return true;
        }
        else throw new Error('BoundingBox.contains(bBox): bBox has not been defined.');
    }
};

module.exports = BoundingBox;