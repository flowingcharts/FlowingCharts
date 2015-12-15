/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Point} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          geom/Point 
 * @requires        utils/util
 */

// Required modules.
var util = require('../utils/util');

/** 
 * @classdesc A Point defined by its <code>x</code> and <code>y</code> 
 * 
 * @class
 * @alias Point
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [x = 0] The x coord.
 * @param {number} [y = 0] The y coord.
 */
function Point (x, y)
{
    // Private instance members.
    this._x = null; // The x coord.
    this._y = null; // The y coord.

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    this.setCoords(x, y);
}

/** 
 * Set the coordinates.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The x coord.
 * @param {number} [y] The y coord.
 *
 * @return {Point}     <code>this</code>.
 */
Point.prototype.setCoords = function (x, y)
{
    if (arguments.length > 0)
    {
        if (x !== undefined) this.x(x);
        if (y !== undefined) this.y(y);
    }
    return this;
};

/** 
 * Get or set the x coord of the left edge.
 *
 * @since 0.1.0
 *
 * @param {number} [coord] The coordinate.
 *
 * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Point.prototype.x = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(coord)) throw new Error('Point.x(coord): coord must be a number.');
        //</validation>
        this._x = coord;
        return this;
    }
    else return this._x;
};

/** 
 * Get or set the y coord of the top edge.
 *
 * @since 0.1.0
 *
 * @param {number} [coord] The coordinate.
 *
 * @return {number|Point} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
Point.prototype.y = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(coord)) throw new Error('Point.y(coord): coord must be a number.');
        //</validation>
        this._y = coord;
        return this;
    }
    else return this._y;
};

/** 
 * Returns a clone of this Point.        
 * 
 * @since 0.1.0
 *
 * @return {Point} The Point.   
 */
Point.prototype.clone = function ()
{
    return new Point(this._x, this._y);
};

module.exports = Point;