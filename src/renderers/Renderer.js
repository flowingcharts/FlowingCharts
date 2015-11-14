/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Renderer} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/Renderer 
 * @requires util
 */

// Required modules.
var util = require('../util');
var isColor = util.isColor;
var isNumber = util.isNumber;

/** 
 * @classdesc A base wrapper class for rendering.
 *
 * @class
 * @alias Renderer
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer.
 */
function Renderer (options)
{
    options = options !== undefined ? options : {};
}

Renderer.prototype = 
{
    // Private variables.

    // Default styles.
    _defaultFillColor       : '#ffffff', 
    _defaultFillOpacity     : 1,
    _defaultLineColor       : '#000000', 
    _defaultLineWidth       : 1, 
    _defaultLineJoin        : 'round',
    _defaultLineCap         : 'butt',
    _defaultLineOpacity     : 1,

    // Current styles override default styles.
    _fillColor      : '#ffffff', 
    _fillOpacity    : 1,
    _lineColor      : '#000000',  
    _lineWidth      : 1, 
    _lineJoin       : 'round', 
    _lineCap        : 'butt', 
    _lineOpacity    : 1, 

    /** 
     * The drawing canvas.
     * 
     * @since 0.1.0
     * @type HTMLElement
     * @default null
     */
    canvas : null,

    /** 
     * Clears the drawing canvas.
     *
     * @since 0.1.0
     * @return {Renderer} <code>this</code>.
     */
    clear : function ()
    {
        return this;
    },

    /** 
     * Overrides the default fill style. Call this method before [fill()]{@link Renderer#fill}.
     *
     * @since 0.1.0
     * @param {Object} [options] The fill properties.
     * @param {string} [options.color] The fill color.
     * @param {number} [options.opacity] The fill opacity.
     * @return {Renderer} <code>this</code>.
     */
    startFill : function (options)
    {
        if (options !== undefined) 
        {
            if (options.color !== undefined)    this.fillColor(options.color);
            if (options.opacity !== undefined)  this.fillOpacity(options.opacity);
        }
        return this;
    },

    /** 
     * Draws a shape by filling its content area. The arguments override the default fill style.
     *
     * @since 0.1.0
     * @param {Object} [options] The fill properties.
     * @param {string} [options.color] The fill color.
     * @param {number} [options.opacity] The fill opacity.
     * @return {Renderer} <code>this</code>.
     */
    fill : function (options)
    {
        return this;
    },

    /** 
     * Resets to default fill style. Call this method after [fill()]{@link Renderer#fill}.
     *
     * @since 0.1.0
     * @return {Renderer} <code>this</code>.
     */
    endFill : function ()
    {
        this.fillColor(this._defaultFillColor).fillOpacity(this._defaultFillOpacity);
        return this;
    },

    /** 
     * Overrides the default stroke style. Call this method before [stroke()]{@link Renderer#stroke}.
     *
     * @since 0.1.0
     * @param {Object} [options] The stroke properties.
     * @param {string} [options.color] The line color.
     * @param {number} [options.width] The line width.
     * @param {string} [options.join] The line join.
     * @param {string} [options.cap] The line cap.
     * @param {number} [options.opacity] The fill opacity.
     * @return {Renderer} <code>this</code>.
     */
    startStroke : function (options)
    {
        if (options !== undefined) 
        {
            if (options.color !== undefined)    this.lineColor(options.color);
            if (options.width !== undefined)    this.lineWidth(options.width);
            if (options.join !== undefined)     this.lineJoin(options.join);
            if (options.cap !== undefined)      this.lineCap(options.cap);
            if (options.opacity !== undefined)  this.lineOpacity(options.opacity);
        }
        return this;
    },

    /** 
     * Draws a shape by stroking its outline. The arguments override the default stroke style.
     *
     * @since 0.1.0
     * @param {Object} [options] The stroke properties.
     * @param {string} [options.color] The line color.
     * @param {number} [options.width] The line width.
     * @param {string} [options.join] The line join.
     * @param {string} [options.cap] The line cap.
     * @param {number} [options.opacity] The fill opacity.
     * @return {Renderer} <code>this</code>.
     */
    stroke : function (options)
    {
        return this;
    },

    /** 
     * Resets to default stroke style. Call this method after [stroke()]{@link Renderer#stroke}.
     *
     * @since 0.1.0
     * @return {Renderer} <code>this</code>.
     */
    endStroke : function ()
    {
        this.lineColor(this._defaultLineColor)
            .lineWidth(this._defaultLineWidth)
            .lineJoin(this._defaultLineJoin)
            .lineCap(this._defaultLineCap)
            .lineOpacity(this._defaultLineOpacity);
        return this;
    },

    /** 
     * Defines the default stroke style. This can be overridden on a shape by 
     * shape basis by calling [fillColor()]{@link Renderer#fillColor} or [fillOpacity()]{@link Renderer#fillOpacity}.  
     *
     * @since 0.1.0
     * @param {Object} [options] The fill properties.
     * @param {string} [options.color] The fill color.
     * @param {number} [options.opacity] The fill opacity.
     * @return {Renderer} <code>this</code>.
     */
    fillStyle : function (options)
    {
        if (options !== undefined) 
        {
            if (options.color !== undefined)    this._defaultFillColor     = options.color;
            if (options.opacity !== undefined)  this._defaultFillOpacity   = options.opacity;
        }
        return this;
    },

    /** 
     * Defines the default fill style. This can be overridden on a shape by 
     * shape basis by calling {@link lineColor()}, {@link lineWidth()}, 
     * {@link lineJoin()}, {@link lineCap()} or {@link lineOpacity()}.  
     *
     * @since 0.1.0
     * @param {Object} [options] The stroke properties.
     * @param {string} [options.color] The line color.
     * @param {number} [options.width] The line width.
     * @param {string} [options.join] The line join.
     * @param {string} [options.cap] The line cap.
     * @param {number} [options.opacity] The fill opacity.
     * @return {Renderer} <code>this</code>.
     */
    strokeStyle : function (options)
    {
        if (arguments.length > 0)
        {
            if (options.color !== undefined)    this._defaultLineColor     = options.color;
            if (options.width !== undefined)    this._defaultLineWidth     = options.width;
            if (options.join !== undefined)     this._defaultLineJoin      = options.join;
            if (options.cap !== undefined)      this._defaultLineCap       = options.cap;
            if (options.opacity !== undefined)  this._defaultLineOpacity   = options.opacity;
        }
        return this;
    },

    /** 
     * Get or set the fill color.
     *
     * @since 0.1.0

     * @param {string} color The fill color.
     * @return {string|Renderer} The fill color if no arguments are supplied, otherwise <code>this</code>.
     */
    fillColor : function (color)
    {
        if (arguments.length > 0)
        {
            //<validation>
            if (!isColor(color)) throw new Error('Renderer.fillColor(color): color must be a color.');
            //</validation>

            this._fillColor = color;
            return this;
        }
        else return this._fillColor;
    },

    /** 
     * Get or set the fill opacity.
     *
     * @since 0.1.0

     * @param {string} opacity The fill opacity.
     * @return {number|Renderer} The fill opacity if no arguments are supplied, otherwise <code>this</code>.
     */
    fillOpacity : function (opacity)
    {
        if (arguments.length > 0)
        {
            //<validation>
            if (!isNumber(opacity)) throw new Error('Renderer.fillOpacity(opacity): opacity must be a number.');
            //</validation>

            opacity = Math.max(0, opacity);
            opacity = Math.min(1, opacity);

            this._fillOpacity = opacity;
            return this;
        }
        else return this._fillOpacity;
    },

    /** 
     * Get or set the line color.
     *
     * @since 0.1.0
     * @param {string} color The line color.
     * @return {string|Renderer} The line color if no arguments are supplied, otherwise <code>this</code>.
     */
    lineColor : function (color)
    {
        if (arguments.length > 0)
        {
            //<validation>
            if (!isColor(color)) throw new Error('Renderer.lineColor(color): color must be a color.');
            //</validation>

            this._lineColor = color;
            return this;
        }
        else return this._lineColor;
    },

    /** 
     * Get or set the line width.
     *
     * @since 0.1.0
     * @param {number} width The line width.
     * @return {number|Renderer} The line width if no arguments are supplied, otherwise <code>this</code>.
     */
    lineWidth : function (width)
    {
        if (arguments.length > 0)
        {
            //<validation>
            if (!isNumber(width)) throw new Error('Renderer.lineWidth(width): width must be a number.');
            if (width < 0)        throw new Error('Renderer.lineWidth(width): width must be > 0.');
            //</validation>

            this._lineWidth = width;
            return this;
        }
        else return this._lineWidth;
    },

    /** 
     * Get or set the line join.
     *
     * @since 0.1.0
     * @param {string} join The line join, one of "bevel", "round", "miter".
     * @return {string|Renderer} The line join if no arguments are supplied, otherwise <code>this</code>.
     */
    lineJoin : function (join)
    {
        if (arguments.length > 0)
        {
            //<validation>
            if (join !== "bevel" && join !== "round" && join !== "miter")
                 throw new Error('Renderer.lineJoin(join): join must one of "bevel", "round", "miter"');
            //</validation>
          
            this._lineJoin = join;
            return this;
        }
        else return this._lineJoin;
    },

    /** 
     * Get or set the line cap.
     *
     * @since 0.1.0
     * @param {string} cap The line cap, one of "butt", "round", "square".
     * @return {string|Renderer} The line cap if no arguments are supplied, otherwise <code>this</code>.
     */
    lineCap : function (cap)
    {
        if (arguments.length > 0)
        {
            //<validation>
            if (cap !== "butt" && cap !== "round" && cap !== "square")
                 throw new Error('Renderer.lineCap(cap): cap must one of "butt", "round", "square"');
            //</validation>

            this._lineCap = cap;
            return this;
        }
        else return this._lineCap;
    },

    /** 
     * Get or set the line opacity.
     *
     * @since 0.1.0
     * @param {string} opacity A value between 0 and 0..
     * @return {number|Renderer} The line opacity if no arguments are supplied, otherwise <code>this</code>.
     */
    lineOpacity : function (opacity)
    {
        if (arguments.length > 0)
        {
            //<validation>
            if (!isNumber(opacity)) throw new Error('Renderer.lineOpacity(opacity): opacity must be a number.');
            //</validation>

            this._lineOpacity = opacity;
            return this;
        }
        else return this._lineOpacity;
    },

    /** 
     * Draws a rectangle.
     *
     * @since 0.1.0
     * @param {number} x The x-coord of the top left corner.
     * @param {number} y The y coord of the top left corner.
     * @param {number} w The width.
     * @param {number} h The height.
     * @return {Renderer} <code>this</code>.
     */
    rect : function (x, y, w, h)
    {
        return this;
    },

    /** 
     * Draws a circle.
     *
     * @since 0.1.0
     * @param {number} cx The x-coord of the centre of the circle.
     * @param {number} cy The y-coord of the centre of the circle.
     * @param {number} r The circle radius.
     * @return {Renderer} <code>this</code>.
     */
    circle : function (cx, cy, r)
    {
        return this;
    }
};

module.exports = Renderer;