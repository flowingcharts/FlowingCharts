/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the Rectangle class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/Rectangle 
 */

/** 
 * @classdesc A rectangle defined by its <code>x</code>, <code>y</code> 
 * <code>width</code> and <code>height</code>.
 * 
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [x = 0] The x-coord of the left edge.
 * @param {number} [y = 0] The y coord of the top edge.
 * @param {number} [width = 100] The width.
 * @param {number} [height = 100] The height.
 */
function Rectangle (x, y, width, height)
{
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    width = width !== undefined ? width : 100;
    height = height !== undefined ? height : 100;
    this.setCoords(xMin, yMin, xMax, yMax);
}

Rectangle.prototype = 
{
    // Private variables
    _x      : null, // The x-coord of the left edge.
    _y      : null, // The y-coord of the top edge.
    _width  : null, // The width.
    _height : null, // The height.

    /** 
     * Set the coordinates.
     *
     * @since 0.1.0
     * @param {number} [x] The x-coord of the left edge.
     * @param {number} [y] The y coord of the top edge.
     * @param {number} [width] The width.
     * @param {number} [height] The height.
     * @return {Rectangle} <code>this</code>.
     */
    setCoords : function (x, y, width, height)
    {
        if (arguments.length > 0)
        {
            if (x !== undefined) this.x(x);
            if (y !== undefined) this.y(y);
            if (width !== undefined) this.width(width);
            if (height !== undefined) this.height(height);
        }
        return this;
    },

    /** 
     * Get or set the x-coord of the left edge.
     *
     * @since 0.1.0
     * @param {number} [coord] The coordinate.
     * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if coord is not a number.
     */
    x : function (coord)
    {
        if (arguments.length > 0)
        {
            if (typeof coord !== 'number') throw 'Rectangle.x(coord): coord must be a number.';

            this._x = coord;
            return this;
        }
        else return this._x;
    },

    /** 
     * Get or set the y-coord of the top edge.
     *
     * @since 0.1.0
     * @param {number} [coord] The coordinate.
     * @return {number|Rectangle} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if coord is not a number.
     */
    y : function (coord)
    {
        if (arguments.length > 0)
        {
            if (typeof coord !== 'number') throw 'Rectangle.y(coord): coord must be a number.';

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
     * @throws {string} Will throw an error if w is not a number or is less than 0.
     */
    width : function (w)
    {
        if (arguments.length > 0)
        {
            if (typeof w !== 'number')  throw 'Rectangle.width(w): w must be a number.';
            if (w < 0)                  throw 'Rectangle.width(w): w must be > 0.';

            this._width = w;
            return this;
        }
        else return this._width;
    },

    /** 
     * Get or set the height.
     *
     * @since 0.1.0
     * @param {number} [h] The height.
     * @return {number|Rectangle} The height if no arguments are supplied, otherwise <code>this</code>.
     * @throws {string} Will throw an error if h is not a number or is less than 0.
     */
    height : function (h)
    {
        if (arguments.length > 0)
        {
            if (typeof h !== 'number') throw 'Rectangle.height(h): h must be a number.';
            if (h < 0)                 throw 'Rectangle.height(h): h must be > 0.';

            this._height = h;
            return this;
        }
        else return this._yCenter;
    },

    /** 
     * Returns a clone of this rectangle.        
     * 
     * @since 0.1.0
     * @return {Rectangle} The rectangle.   
     */
    clone : function ()
    {
        return new Rectangle(this._x, this._y, this._width, this._height);
    }
};

module.exports = Rectangle;