/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link ShapeItem} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/ShapeItem 
 * @requires ./CanvasItem
 * @requires utils/util
 */

// Required modules.
var CanvasItem  = require('./CanvasItem');
var util        = require('../utils/util');
var extendClass = util.extendClass;
var isNumber    = util.isNumber;

/** 
 * @classdesc A shape item is defined by its <code>x</code>, <code>y</code> 
 * <code>width</code> and <code>height</code>.
 * 
 * @class
 * @alias ShapeItem
 * @augments CanvasItem
 * @since 0.1.0
 * @constructor
 *
 * @param {string} type The shape type.
 * @param {number} x The x coord of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} width The width.
 * @param {number} height The height.
 */
function ShapeItem (type, x, y, width, height)
{
    ShapeItem.baseConstructor.call(this, type);

    //<validation>
    if (!isNumber(x)) throw new Error('ShapeItem.(type, x, y, width, height): x must be a number.');
    if (!isNumber(y)) throw new Error('ShapeItem.(type, x, y, width, height): y must be a number.');
    if (!isNumber(width)) throw new Error('ShapeItem.(type, x, y, width, height): width must be a number.');
    if (!isNumber(height)) throw new Error('ShapeItem.(type, x, y, width, height): height must be a number.');
    //</validation>

    // Private instance members.
    this._x = null; // The x coord of the top left corner.
    this._y = null; // The y coord of the top left corner.
    this._w = null; // The width.
    this._h = null; // The height.

    this.setDimensions(x, y, width, height);
}
extendClass(CanvasItem, ShapeItem);

/** 
 * Set the dimensions.
 *
 * @since 0.1.0
 * @param {number} [x] The x coord of the top left corner.
 * @param {number} [y] The y coord of the top left corner.
 * @param {number} [w] The width.
 * @param {number} [h] The height.
 * @return {ShapeItem} <code>this</code>.
 */
ShapeItem.prototype.setDimensions = function (x, y, w, h)
{
    if (arguments.length > 0)
    {
        if (x !== undefined) this.x(x);
        if (y !== undefined) this.y(y);
        if (w !== undefined) this.width(w);
        if (h !== undefined) this.height(h);
    }
    return this;
};

/** 
 * Get or set the x coord of the top left corner.
 *
 * @since 0.1.0
 * @param {number} [coord] The coordinate.
 * @return {number|ShapeItem} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ShapeItem.prototype.x = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(coord)) throw new Error('ShapeItem.x(coord): coord must be a number.');
        //</validation>
        this._x = coord;
        return this;
    }
    else return this._x;
};

/** 
 * Get or set the y coord of the top left corner.
 *
 * @since 0.1.0
 * @param {number} [coord] The coordinate.
 * @return {number|ShapeItem} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ShapeItem.prototype.y = function (coord)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(coord)) throw new Error('ShapeItem.y(coord): coord must be a number.');
        //</validation>
        this._y = coord;
        return this;
    }
    else return this._y;
};

/** 
 * Get or set the width.
 *
 * @since 0.1.0
 * @param {number} [w] The width.
 * @return {number|ShapeItem} The width if no arguments are supplied, otherwise <code>this</code>.
 */
ShapeItem.prototype.width = function (w)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(w)) throw new Error('ShapeItem.width(w): w must be a number.');
        if (w < 0)        throw new Error('ShapeItem.width(w): w must be >= 0.');
        //</validation>
        this._w = w;
        return this;
    }
    else return this._w;
};

/** 
 * Get or set the height.
 *
 * @since 0.1.0
 * @param {number} [h] The height.
 * @return {number|ShapeItem} The height if no arguments are supplied, otherwise <code>this</code>.
 */
ShapeItem.prototype.height = function (h)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(h)) throw new Error('ShapeItem.height(h): h must be a number.');
        if (h < 0)        throw new Error('ShapeItem.height(h): h must be >= 0.');
        //</validation>
        this._h = h;
        return this;
    }
    else return this._h;
};

module.exports = ShapeItem;