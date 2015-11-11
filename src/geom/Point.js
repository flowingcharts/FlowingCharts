/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the Point class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/Point 
 */

// Required modules.
var util = require('../util');
var isNumber = util.isNumber;

/** 
 * @classdesc A Point defined by its <code>x</code>, <code>y</code> 
 * 
 * @since 0.1.0
 * @constructor
 *
 * @requires util.isNumber
 *
 * @param {number} [x = 0] The x-coord.
 * @param {number} [y = 0] The y coord.
 */
function Point (x, y)
{
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    this.setCoords(x, y);
}

Point.prototype = 
{
    // Private variables.
    _x : null, // The x-coord.
    _y : null, // The y-coord.

    /** 
     * Set the coordinates.
     *
     * @since 0.1.0
     * @param {number} [x] The x-coord.
     * @param {number} [y] The y coord.
     * @return {Point} <code>this</code>.
     */
    setCoords : function (x, y)
    {
        if (arguments.length > 0)
        {
            if (x !== undefined) this.x(x);
            if (y !== undefined) this.y(y);
        }
        return this;
    },

    /** 
     * Get or set the x-coord of the left edge.
     *
     * @since 0.1.0
     * @param {number} [coord] The coordinate.
     * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Will throw an error if coord is not a number.
     */
    x : function (coord)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(coord)) throw new Error('Point.x(coord): coord must be a number.');

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
     * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
     * @throws {Error} Will throw an error if coord is not a number.
     */
    y : function (coord)
    {
        if (arguments.length > 0)
        {
            if (!isNumber(coord)) throw new Error('Point.y(coord): coord must be a number.');

            this._y = coord;
            return this;
        }
        else return this._y;
    },

    /** 
     * Returns a clone of this Point.        
     * 
     * @since 0.1.0
     * @return {Point} The Point.   
     */
    clone : function ()
    {
        return new Point(this._x, this._y);
    }
};

module.exports = Point;