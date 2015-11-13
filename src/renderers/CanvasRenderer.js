/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Exports the {@link CanvasRenderer} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/CanvasRenderer 
 * @requires renderers/Renderer
 * @requires util
 */

// Required modules.
var Renderer = require('./Renderer');
var util = require('../util');
var extendClass = util.extendClass;
var extendObject = util.extendObject;
var appendTo = util.appendTo;

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias CanvasRenderer
 * @augments Renderer
 * @since 0.1.0
 * @author J Clare
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

extendObject(CanvasRenderer.prototype, /** @lends CanvasRenderer.prototype  */
{
    /** 
     * The canvas context.
     * 
     * @since 0.1.0
     * @type HTMLCanvasContext
     * @default null
     */
    context : null,

    /** 
     * @inheritdoc
     */
    clear : function ()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    },

    /** 
     * @inheritdoc
     */
    fill : function (options)
    {
        // TODO opacity
        this.startFill(options);

        this.context.fillStyle      = this.fillColor();
        this.context.fill();

        this.endFill();
        return this;
    },

    /** 
     * @inheritdoc
     */
    stroke : function (options)
    {
        // TODO Opacity
        this.startStroke(options);
        window.console.log(this.lineWidth());

        this.context.strokeStyle    = this.lineColor();
        this.context.lineWidth      = this.lineWidth();
        this.context.lineJoin       = this.lineJoin();
        this.context.lineCap        = this.lineCap();
        this.context.stroke();

        this.endStroke();
        return this;
    },

    /** 
     * @inheritdoc
     */
    rect : function (x, y, w, h)
    {
        this.context.beginPath();
        this.context.rect(x, y, w, h);
        return this;
    },

    /** 
     * @inheritdoc
     */
    circle : function (cx, cy, r)
    {
        this.context.beginPath();
        this.context.arc(cx, cy, r, 0, 2 * Math.PI, false);
        return this;
    }
});

module.exports = CanvasRenderer;