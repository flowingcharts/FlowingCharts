/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the CanvasRenderer class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/CanvasRenderer 
 */

// Required modules.
var Renderer = require('./Renderer');
var util = require('../util');
var extendClass = util.extendClass;
var extendObject = util.extendObject;
var appendTo = util.appendTo;

/** 
 * @class CanvasRenderer
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @since 0.1.0
 * @author J Clare
 * @constructor
 * @augments renderers/Renderer
 *
 * @requires renderers/Renderer
 * @requires util.extendClass
 * @requires util.extendObject
 * @requires util.appendTo
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer.
 */
function CanvasRenderer (options)
{
    CanvasRenderer.baseConstructor.call(this, options);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    appendTo(this.canvas, options.container, options.onResize);
}
extendClass(Renderer, CanvasRenderer);

extendObject(CanvasRenderer.prototype,
{
    /** 
     * The canvas element.
     * 
     * @memberof CanvasRenderer
     * @since 0.1.0
     * @type HTMLCanvas
     * @default null
     */
    canvas : null,

    /** 
     * The canvas context.
     * 
     * @memberof CanvasRenderer
     * @since 0.1.0
     * @type HTMLCanvasContext
     * @default null
     */
    context : null,

    /** 
     * @inheritdoc
     * @memberof CanvasRenderer
     */
    clear : function ()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    },

    /** 
     * @inheritdoc
     * @memberof CanvasRenderer
     */
    fill : function (options)
    {
        // TODO opacity
        // TODO join and cap options

        // Temporary styles.
        var fillColor   = this._tempFillColor;
        var fillOpacity = this._tempFillOpacity;

        // Option styles override temporary styles.
        if (options !== undefined)
        {
            if (options.color !== undefined)    fillColor = options.color;
            if (options.opacity !== undefined)  fillOpacity = options.opacity;
        }

        // Apply styles.
        this.context.fillStyle = fillColor;

        // Apply fill.
        this.context.fill();

        // Reset temporary styles to default styles.
        this._tempFillColor     = this._fillColor; 
        this._tempFillOpacity   = this._fillOpacity; 

        return this;
    },

    /** 
     * @inheritdoc
     * @memberof CanvasRenderer
     */
    stroke : function (options)
    {
        // TODO Opacity

        // Temporary styles.
        var lineColor   = this._tempLineColor;
        var lineWidth   = this._tempLineWidth;
        var lineJoin    = this._tempLineJoin;
        var lineCap     = this._tempLineCap;
        var lineOpacity = this._tempLineOpacity;

        // Option styles override temporary styles.
        if (options !== undefined)
        {
            if (options.color !== undefined)    lineColor = options.color;
            if (options.width !== undefined)    lineWidth = options.width;
            if (options.join !== undefined)     lineJoin = options.join;
            if (options.cap !== undefined)      lineCap = options.cap;
            if (options.opacity !== undefined)  lineOpacity = options.opacity;
        }

        // Apply styles.
        this.context.strokeStyle    = lineColor;
        this.context.lineWidth      = lineWidth;
        this.context.lineJoin       = lineJoin;
        this.context.lineCap        = lineCap;

        // Apply stroke.
        this.context.stroke();

        // Reset temporary styles to default styles.
        this._tempLineColor     = this._lineColor; 
        this._tempLineWidth     = this._lineWidth;
        this._tempLineJoin      = this._lineJoin; 
        this._tempLineCap       = this._lineCap; 
        this._tempLineOpacity   = this._lineOpacity; 

        return this;
    },

    /** 
     * @inheritdoc
     * @memberof CanvasRenderer
     */
    rect : function (x, y, w, h)
    {
        this.context.beginPath();
        this.context.rect(x, y, w, h);
        return this;
    },

    /** 
     * @inheritdoc
     * @memberof CanvasRenderer
     */
    circle : function (cx, cy, r)
    {
        this.context.beginPath();
        this.context.arc(cx, cy, r, 0, 2 * Math.PI, false);
        return this;
    }
});

module.exports = CanvasRenderer;