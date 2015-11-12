/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the Rectangle class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/Rectangle 
 */

// Required modules.
var util = require('../util');
var isNumber = util.isNumber;

/** 
 * @classdesc A rectangle defined by its <code>x</code>, <code>y</code> 
 * <code>width</code> and <code>height</code>.
 * 
 * @since 0.1.0
 * @constructor
 *
 * @requires util.isNumber
 *
 * @param {number} [x = 0] The x-coord of the top left corner.
 * @param {number} [y = 0] The y coord of the top left corner.
 * @param {number} [width = 100] The width.
 * @param {number} [height = 100] The height.
 */
function Rectangle (x, y, width, height)
{
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    width = width !== undefined ? width : 100;
    height = height !== undefined ? height : 100;
    this.setCoords(x, y, width, height);
}

Rectangle.prototype = 
{
    // Private variables.
    _x : null, // The x-coord of the top left corner.
    _y : null, // The y-coord of the top left corner.
    _w : null, // The width.
    _h : null, // The height.

    /** 
     * Set the coordinates.
     *
     * @since 0.1.0
     * @param {number} [x] The x-coord of the top left corner.
     * @param {number} [y] The y coord of the top left corner.
     * @param {number} [w] The width.
     * @param {number} [h] The height.
     * @return {Rectangle} <code>this</code>.
     */
    setCoords : function (x, y, w, h)
    {
        if (arguments.length > 0)
        {
            if (x !== undefined) this.x(x);
            if (y !== undefined) this.y(y);
            if (w !== undefined) this.width(w);
            if (h !== undefined) this.height(h);
        }
        return this;
    },

    /** 
     * Get or set the x-coord of the top left corner.
     *
     * @since 0.1.0
     * @param {number} [coord] The coordinate.
     * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Will throw an error if coord is not a number.
     */
    x : function (coord)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(coord)) throw new Error('Rectangle.x(coord): coord must be a number.');

            this._x = coord;
            return this;
        }
        else return this._x;
    },

    /** 
     * Get or set the y-coord of the top left corner.
     *
     * @since 0.1.0
     * @param {number} [coord] The coordinate.
     * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Will throw an error if coord is not a number.
     */
    y : function (coord)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(coord)) throw new Error('Rectangle.y(coord): coord must be a number.');

            this._y = coord;
            return this;
        }
        else return this._y;
    },

    /** 
     * Get or set the width.
     *
     * @since 0.1.0
     * @param {number} [w] The width.
     * @return {number|Rectangle} The width if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Will throw an error if w is not a number or is less than 0.
     */
    width : function (w)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(w)) throw new Error('Rectangle.width(w): w must be a number.');
            if (w < 0)        throw new Error('Rectangle.width(w): w must be > 0.');

            this._w = w;
            return this;
        }
        else return this._w;
    },

    /** 
     * Get or set the height.
     *
     * @since 0.1.0
     * @param {number} [h] The height.
     * @return {number|Rectangle} The height if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Will throw an error if h is not a number or is less than 0.
     */
    height : function (h)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(h)) throw new Error('Rectangle.height(h): h must be a number.');
            if (h < 0)        throw new Error('Rectangle.height(h): h must be > 0.');

            this._h = h;
            return this;
        }
        else return this._h;
    },

    /** 
     * Returns a clone of this rectangle.        
     * 
     * @since 0.1.0
     * @return {Rectangle} The rectangle.   
     */
    clone : function ()
    {
        return new Rectangle(this._x, this._y, this._w, this._h);
    }
};

module.exports = Rectangle;