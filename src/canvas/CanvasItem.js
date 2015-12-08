/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link CanvasItem} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/CanvasItem 
 * @requires utils/util
 * @requires utils/color
 */

// Required modules.
var util        = require('../utils/util');
var isNumber    = util.isNumber;
var color       = require('../utils/color');
var isColor     = color.isColor;

/** 
 * @classdesc Holds properties of canvas items.
 *
 * @class
 * @alias CanvasItem
 * @since 0.1.0
 * @constructor
 *
 * @param {string} type The shape type.
 */
function CanvasItem (type)
{
    // Private instance members.
    this._type          = type; // The shape type.

    // Styles.
    this._fillColor     = '#ffffff'; 
    this._fillOpacity   = 1;
    this._lineColor     = '#000000';  
    this._lineWidth     = 1; 
    this._lineJoin      = 'round'; 
    this._lineCap       = 'butt'; 
    this._lineOpacity   = 1;
}

/** 
 * Get the type.
 *
 * @since 0.1.0
 * @return {string} The shape type.
 */
CanvasItem.prototype.type = function ()
{
    return this._type;
};

/** 
 * Defines the stroke style.
 *
 * @since 0.1.0
 * @param {Object} [options] The fill properties.
 * @param {string} [options.fillColor] The fill color.
 * @param {number} [options.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string} [options.lineColor] The line color.
 * @param {number} [options.lineWidth] The line width.
 * @param {string} [options.lineJoin] The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap] The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 * @return {CanvasItem} <code>this</code>.
 */
CanvasItem.prototype.style = function (options)
{
    if (options !== undefined) 
    {
        if (options.fillColor !== undefined)    this.fillColor(options.fillColor);
        if (options.fillOpacity !== undefined)  this.fillOpacity(options.fillOpacity);
        if (options.lineColor !== undefined)    this.lineColor(options.lineColor);
        if (options.lineWidth !== undefined)    this.lineWidth(options.lineWidth);
        if (options.lineJoin !== undefined)     this.lineJoin(options.lineJoin);
        if (options.lineCap !== undefined)      this.lineCap(options.lineCap);
        if (options.lineOpacity !== undefined)  this.lineOpacity(options.lineOpacity);
    }
    return this;
};

/** 
 * Get or set the fill color.
 *
 * @since 0.1.0

 * @param {string} color The fill color.
 * @return {string|CanvasItem} The fill color if no arguments are supplied, otherwise <code>this</code>.
 */
CanvasItem.prototype.fillColor = function (color)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isColor(color)) throw new Error('CanvasItem.fillColor(color): color must be a color.');
        //</validation>

        this._fillColor = color;
        return this;
    }
    else return this._fillColor;
};

/** 
 * Get or set the fill opacity. This is overriden by the fillColor if it contains an alpha value.
 *
 * @since 0.1.0

 * @param {string} opacity The fill opacity.
 * @return {number|CanvasItem} The fill opacity if no arguments are supplied, otherwise <code>this</code>.
 */
CanvasItem.prototype.fillOpacity = function (opacity)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(opacity)) throw new Error('CanvasItem.fillOpacity(opacity): opacity must be a number.');
        //</validation>

        opacity = Math.max(0, opacity);
        opacity = Math.min(1, opacity);

        this._fillOpacity = opacity;
        return this;
    }
    else return this._fillOpacity;
};

/** 
 * Get or set the line color.
 *
 * @since 0.1.0
 * @param {string} color The line color.
 * @return {string|CanvasItem} The line color if no arguments are supplied, otherwise <code>this</code>.
 */
CanvasItem.prototype.lineColor = function (color)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isColor(color)) throw new Error('CanvasItem.lineColor(color): color must be a color.');
        //</validation>

        this._lineColor = color;
        return this;
    }
    else return this._lineColor;
};

/** 
 * Get or set the line width.
 *
 * @since 0.1.0
 * @param {number} width The line width.
 * @return {number|CanvasItem} The line width if no arguments are supplied, otherwise <code>this</code>.
 */
CanvasItem.prototype.lineWidth = function (width)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(width)) throw new Error('CanvasItem.lineWidth(width): width must be a number.');
        if (width < 0)        throw new Error('CanvasItem.lineWidth(width): width must be >= 0.');
        //</validation>

        this._lineWidth = width;
        return this;
    }
    else return this._lineWidth;
};

/** 
 * Get or set the line join.
 *
 * @since 0.1.0
 * @param {string} join The line join, one of "bevel", "round", "miter".
 * @return {string|CanvasItem} The line join if no arguments are supplied, otherwise <code>this</code>.
 */
CanvasItem.prototype.lineJoin = function (join)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (join !== "bevel" && join !== "round" && join !== "miter")
             throw new Error('CanvasItem.lineJoin(join): join must one of "bevel", "round", "miter"');
        //</validation>
      
        this._lineJoin = join;
        return this;
    }
    else return this._lineJoin;
};

/** 
 * Get or set the line cap.
 *
 * @since 0.1.0
 * @param {string} cap The line cap, one of "butt", "round", "square".
 * @return {string|CanvasItem} The line cap if no arguments are supplied, otherwise <code>this</code>.
 */
CanvasItem.prototype.lineCap = function (cap)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (cap !== "butt" && cap !== "round" && cap !== "square")
             throw new Error('CanvasItem.lineCap(cap): cap must one of "butt", "round", "square"');
        //</validation>

        this._lineCap = cap;
        return this;
    }
    else return this._lineCap;
};

/** 
 * Get or set the line opacity. This is overriden by the lineColor if it contains an alpha value.
 *
 * @since 0.1.0
 * @param {string} opacity A value between 0 and 1.
 * @return {number|CanvasItem} The line opacity if no arguments are supplied, otherwise <code>this</code>.
 */
CanvasItem.prototype.lineOpacity = function (opacity)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(opacity)) throw new Error('CanvasItem.lineOpacity(opacity): opacity must be a number.');
        //</validation>

        this._lineOpacity = opacity;
        return this;
    }
    else return this._lineOpacity;
};

module.exports = CanvasItem;