/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the Renderer class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/Renderer 
 */

/** 
 * @classdesc A base wrapper class for rendering.
 *
 * @since 0.1.0
 * @author J Clare
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
    _fillColor      : '#ffffff', 
    _fillOpacity    : 1,
    _lineColor      : '#000000', 
    _lineWidth      : 1, 
    _lineJoin       : 'round',
    _lineCap        : 'butt',
    _lineOpacity    : 1,

    // Default styles.
    _tempFillColor : '#ffffff', 
    _tempFillOpacity : 1,
    _tempLineColor : '#000000',  
    _tempLineWidth : 1, 
    _tempLineJoin : 'round', 
    _tempLineCap : 'butt', 
    _tempLineOpacity : 1, 

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
     * Draws a shape by filling its content area. Use the arguments to override the default fill style.
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
     * Draws a shape by stroking its outline. Use the arguments to override the default stroke style.
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
     * Defines the default fill style.
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
            if (options.color !== undefined)    this._fillColor     = options.color;
            if (options.opacity !== undefined)  this._fillOpacity   = options.opacity;
        }
        return this;
    },

    /** 
     * Overrides default fill color.
     *
     * @since 0.1.0

     * @param {string} color The fill color.
     * @return {Renderer} <code>this</code>.
     */
    fillColor : function (color)
    {
        if (color !== undefined) this._tempFillColor = color;
        return this;
    },

    /** 
     * Overrides default fill opacity.
     *
     * @since 0.1.0

     * @param {string} opacity The fill opacity.
     * @return {Renderer} <code>this</code>.
     */
    fillOpacity : function (opacity)
    {
        if (opacity !== undefined) this._tempFillOpacity = opacity;
        return this;
    },

    /** 
     * Defines the default stroke style.
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
        if (options !== undefined)
        {
            if (options.color !== undefined)    this._lineColor     = options.color;
            if (options.width !== undefined)    this._lineWidth     = options.width;
            if (options.join !== undefined)     this._lineJoin      = options.join;
            if (options.cap !== undefined)      this._lineCap       = options.cap;
            if (options.opacity !== undefined)  this._lineOpacity   = options.opacity;
        }
        return this;
    },

    /** 
     * Overrides default line color.
     *
     * @since 0.1.0

     * @param {string} color The line color.
     * @return {Renderer} <code>this</code>.
     */
    lineColor : function (color)
    {
        if (color !== undefined) this._tempLineColor = color;
        return this;
    },

    /** 
     * Overrides default line width.
     *
     * @since 0.1.0

     * @param {string} width The line width.
     * @return {Renderer} <code>this</code>.
     */
    lineWidth : function (width)
    {
        if (width !== undefined) this._tempLineWidth = width;
        return this;
    },


    /** 
     * Overrides default line join.
     *
     * @since 0.1.0

     * @param {string} join The line join.
     * @return {Renderer} <code>this</code>.
     */
    lineJoin : function (join)
    {
        if (join !== undefined) this._tempLineJoin = join;
        return this;
    },


    /** 
     * Overrides default line cap.
     *
     * @since 0.1.0

     * @param {string} cap The line cap.
     * @return {Renderer} <code>this</code>.
     */
    lineCap : function (cap)
    {
        if (cap !== undefined) this._tempLineCap = cap;
        return this;
    },

    /** 
     * Overrides default line opacity.
     *
     * @since 0.1.0

     * @param {string} opacity The line opacity.
     * @return {Renderer} <code>this</code>.
     */
    lineOpacity : function (opacity)
    {
        if (opacity !== undefined) this._tempLineOpacity = opacity;
        return this;
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
     * @return {SvgRenderer} <code>this</code>.
     */
    circle : function (cx, cy, r)
    {
        return this;
    }
};

module.exports = Renderer;