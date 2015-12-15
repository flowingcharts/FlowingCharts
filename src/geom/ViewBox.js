/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link ViewBox} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          geom/ViewBox 
 * @requires        utils/util
 */

// Required modules.
var util = require('../utils/util');

/** 
 * @classdesc An area defined by its position, as indicated 
 * by its bottom-left corner point (<code>xMin</code>, <code>yMin</code>) 
 * and top-right corner point (<code>xMax</code>, <code>yMax</code>).
 * 
 * @class
 * @alias ViewBox
 * @since 0.1.0
 * @constructor
 *
 * @param {number} [xMin = 0]   The x coord of the bottom left corner.
 * @param {number} [yMin = 0]   The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 */
function ViewBox (xMin, yMin, xMax, yMax)
{
    // Private instance members.
    this._xMin      = null; // The x coord of the bottom left corner.
    this._xMax      = null; // The x coord of the top right corner.
    this._xCenter   = null; // The x coord of the center.
    this._width     = null; // The width.
    this._yMin      = null; // The y coord of the bottom left corner.
    this._yMax      = null; // The y coord of the top right corner.
    this._yCenter   = null; // The y coord of the center.
    this._height    = null; // The height.

    xMin = xMin !== undefined ? xMin : 0;
    yMin = yMin !== undefined ? yMin : 0;
    xMax = xMax !== undefined ? xMax : 100;
    yMax = yMax !== undefined ? yMax : 100;
    this.setCoords(xMin, yMin, xMax, yMax);
}

/** 
 * Set the dimensions.
 *
 * @since 0.1.0
 *
 * @param {number} [xMin] The x coord of the bottom left corner.
 * @param {number} [yMin] The y coord of the bottom left corner.
 * @param {number} [xMax] The x coord of the top right corner.
 * @param {number} [yMax] The y coord of the top right corner.
 *
 * @return {ViewBox}      <code>this</code>.
 */
ViewBox.prototype.setCoords = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        if (xMin !== undefined) this.xMin(xMin);
        if (yMin !== undefined) this.yMin(yMin);
        if (xMax !== undefined) this.xMax(xMax);
        if (yMax !== undefined) this.yMax(yMax);
    }
    return this;
};

/** 
 * Get or set the x coord of the bottom left corner.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xMin = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(x)) throw new Error('ViewBox.xMin(x): x must be a number.');
        //</validation>
        this._xMin = x;
        this._width = Math.abs(this._xMax - this._xMin);
        this._xCenter = this._xMin + (this._width / 2); 
        return this;
    }
    else return this._xMin;
};

/** 
 * Get or set the x coord of the top right corner.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xMax = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(x)) throw new Error('ViewBox.xMax(x): x must be a number.');
        //</validation>
        this._xMax = x;
        this._width = Math.abs(this._xMax - this._xMin);
        this._xCenter = this._xMin + (this._width / 2);
        return this;
    }
    else return this._xMax;
};


/** 
 * Get or set the x coord of the center.
 *
 * @since 0.1.0
 *
 * @param {number} [x] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.xCenter = function (x)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(x)) throw new Error('ViewBox.xCenter(x): x must be a number.');
        //</validation>
        this._xCenter = x;
        this._xMin  = this._xCenter - (this._width / 2);
        this._xMax  = this._xCenter + (this._width / 2);
        return this;
    }
    else return this._xCenter;
};


/** 
 * Get or set the width.
 *
 * @since 0.1.0
 *
 * @param {number} [w] The width.
 *
 * @return {number|ViewBox} The width if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.width = function (w)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(w))  throw new Error('ViewBox.width(w): w must be a number.');
        if (w < 0)         throw new Error('ViewBox.width(w): w must be >= 0.');
        //</validation>
        this._width = w;
        this._xMax = this._xMin + this._width;
        this._xCenter = this._xMin + (this._width / 2);
        return this;
    }
    else return this._width;
};

/** 
 * Get or set the y coord of the bottom left corner.
 *
 * @since 0.1.0
 *
 * @param {number} [y] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yMin = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(y)) throw new Error('ViewBox.yMin(y): y must be a number.');
        //</validation>
        this._yMin = y;
        this._height = Math.abs(this._yMax - this._yMin);
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._yMin;
};

/** 
 * Get or set the y coord of the top right corner.
 *
 * @since 0.1.0
 *
 * @param {number} [y] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yMax = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(y)) throw new Error('ViewBox.yMax(y): y must be a number.');
        //</validation>
        this._yMax = y;
        this._height = Math.abs(this._yMax - this._yMin);
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._yMax;
};

/** 
 * Get or set the y coord of the center.
 *
 * @since 0.1.0
 *
 * @param {number} [y] The coordinate.
 *
 * @return {number|ViewBox} The coordinate if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.yCenter = function (y)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(y)) throw new Error('ViewBox.yCenter(y): y must be a number.');
        //</validation>
        this._yCenter = y;
        this._yMin  = this._yCenter - (this._height / 2);
        this._yMax  = this._yCenter + (this._height / 2);
        return this;
    }
    else return this._yCenter;
};

/** 
 * Get or set the height.
 *
 * @since 0.1.0
 *
 * @param {number} [h] The height.
 *
 * @return {number|ViewBox} The height if no arguments are supplied, otherwise <code>this</code>.
 */
ViewBox.prototype.height = function (h)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!util.isNumber(h)) throw new Error('ViewBox.height(h): h must be a number.');
        if (h < 0)        throw new Error('ViewBox.height(h): h must be >= 0.');
        //</validation>
        this._height = h;
        this._yMax = this._yMin + this._height;
        this._yCenter = this._yMin + (this._height / 2);
        return this;
    }
    else return this._height;
};

/** 
 * Returns a clone of this ViewBox.        
 * 
 * @since 0.1.0
 *
 * @return {ViewBox} The ViewBox.   
 */
ViewBox.prototype.clone = function ()
{
    return new ViewBox(this._xMin, this._yMin, this._xMax, this._yMax);
};

/** 
 * Returns true if a ViewBox equals to this one.
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} vb The ViewBox.
 *
 * @return {boolean} true, if the ViewBox is equal to this one, otherwise false.
 */
ViewBox.prototype.equals = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.equals(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() !== this._xMin) return false;
        if (vb.getYMin() !== this._yMin) return false;
        if (vb.getXMax() !== this._xMax) return false;
        if (vb.getYMax() !== this._yMax) return false;
        return true;
    }
    else throw new Error('ViewBox.equals(vb): vb has not been defined.');
};

/** 
 * Returns true if a ViewBox intersects this one.
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} vb The ViewBox.
 *
 * @return {boolean} true, if the ViewBox intercepts this one, otherwise false.
 */
ViewBox.prototype.intersects = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.intersects(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() > this._xMax) return false;
        if (vb.getXMax() < this._xMin) return false;
        if (vb.getYMin() > this._yMax) return false;
        if (vb.getYMax() < this._yMin) return false;
        return true;
    }
    else throw new Error('ViewBox.intersects(vb): vb has not been defined.');
};

/** 
 * Returns true if a ViewBox is contained within this one.
 * 
 * @since 0.1.0
 *
 * @param {ViewBox} vb The ViewBox.
 *
 * @return {boolean} true, if the ViewBox is contained within this one, otherwise false.
 */
ViewBox.prototype.contains = function (vb)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!(vb instanceof ViewBox)) throw new Error('ViewBox.contains(vb): vb must be a ViewBox.');
        //</validation>
        if (vb.getXMin() < this._xMin) return false;
        if (vb.getXMax() > this._xMax) return false;
        if (vb.getYMin() < this._yMin) return false;
        if (vb.getYMax() > this._yMax) return false;
        return true;
    }
    else throw new Error('ViewBox.contains(vb): vb has not been defined.');
};

module.exports = ViewBox;