/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the CanvasRenderer class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/CanvasRenderer 
 */

// Required modules.
var util = require('../util');
var appendTo = util.appendTo;

/** 
 * @class A wrapper class for rendering to a HTML5 canvas.
 *
 * @since 0.1.0
 * @author J Clare
 * @constructor
 *
 * @requires util.appendTo
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer.
 */
function CanvasRenderer (options)
{
    options = options !== undefined ? options : {};

    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    appendTo(this._canvas, options.container, options.onResize);
}

CanvasRenderer.prototype = 
{
    // Private variables.
    _canvas : null,     // The canvas element.
    _context : null,    // The context to draw to.

    /** 
     * Clears the canvas.
     *
     * @since 0.1.0
     * @return {CanvasRenderer} <code>this</code>.
     */
    clear : function ()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        return this;
    },

    /** 
     * Draws a solid shape by filling the path's content area.
     *
     * @since 0.1.0
     * @return {CanvasRenderer} <code>this</code>.
     */
    fill : function ()
    {
        this._context.fill();
        return this;
    },

    /** 
     * Draws the shape by stroking its outline.
     *
     * @since 0.1.0
     * @return {CanvasRenderer} <code>this</code>.
     */
    stroke : function ()
    {
        this._context.stroke();
        return this;
    },

    /** 
     * Defines the fill style.
     *
     * @since 0.1.0
     * @param {string} [color] The fill color.
     * @param {number} [opacity] The fill opacity.
     * @return {CanvasRenderer} <code>this</code>.
     */
    fillStyle : function (color, opacity)
    {
        if (color !== undefined)     this._context.fillStyle = color;
        return this;
    },

    /** 
     * Defines the line style.
     *
     * @since 0.1.0
     * @param {string} [color] The line color.
     * @param {number} [thickness] The line thickness.
     * @param {string} [join] The line join.
     * @param {string} [cap] The line cap.
     * @param {number} [opacity] The fill opacity.
     * @return {CanvasRenderer} <code>this</code>.
     */
    strokeStyle : function (color, thickness, join, cap, opacity)
    {
        if (color !== undefined)     this._context.strokeStyle = color;
        if (thickness !== undefined) this._context.lineWidth = thickness;
        if (join !== undefined)      this._context.lineJoin = join;
        if (cap !== undefined)       this._context.lineCap = cap;
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
     * @return {CanvasRenderer} <code>this</code>.
     */
    rect : function (x, y, w, h)
    {
        this._context.beginPath();
        this._context.rect(x, y, w, h);
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
        this._context.beginPath();
        this._context.arc(cx, cy, r, 0, 2 * Math.PI, false);
        return this;
    }
};

module.exports = CanvasRenderer;