/* jshint browserify: true */
/* globals DEBUG */
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
var isNumber = util.isNumber;

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
 * @param {Renderer~onResize} [options.onResize] Function called when the canvas resizes. 
 */
function CanvasRenderer (options)
{
    // Private instance members.
    this._canvas  = document.createElement('canvas');   // The drawing canvas.
    this._ctx = this._canvas.getContext('2d');          // The drawing context

    CanvasRenderer.baseConstructor.call(this, options);
}
extendClass(Renderer, CanvasRenderer);

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.canvas = function ()
{
    return this._canvas;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.setSize = function (w, h)
{
    //<validation>
    if (!isNumber(w)) throw new Error('Renderer.setSize(w): w must be a number.');
    if (w < 0)        throw new Error('Renderer.setSize(w): w must be > 0.');
    if (!isNumber(h)) throw new Error('Renderer.setSize(h): h must be a number.');
    if (h < 0)        throw new Error('Renderer.setSize(h): h must be > 0.');
    //</validation>

    // http://stackoverflow.com/questions/2588181/canvas-is-stretched-when-using-css-but-normal-with-width-height-properties
    var c = this.canvas();
    c.setAttribute('width', w);
    c.setAttribute('height', h);
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.clear = function ()
{
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    return this;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.drawFill = function ()
{
    // TODO opacity
    this._ctx.fillStyle      = this.fillColor();
    this._ctx.fill();
    return this;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.drawStroke = function (options)
{
    // TODO Opacity
    this._ctx.strokeStyle    = this.lineColor();
    this._ctx.lineWidth      = this.lineWidth();
    this._ctx.lineJoin       = this.lineJoin();
    this._ctx.lineCap        = this.lineCap();
    this._ctx.stroke();
    return this;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.rect = function (x, y, w, h)
{
    this._ctx.beginPath();
    this._ctx.rect(x, y, w, h);
    return this;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.circle = function (cx, cy, r)
{
    this._ctx.beginPath();
    this._ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    return this;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.ellipse = function (cx, cy, rx, ry)
{
    var kappa = 0.5522848,
    x =  cx - rx / 2,      // top left x position.
    y =  cy - ry / 2,      // top left y position.
    ox = (rx / 2) * kappa, // control point offset horizontal.
    oy = (ry / 2) * kappa, // control point offset vertical.
    xe = x + rx,           // x-end.
    ye = y + ry,           // y-end.
    xm = x + rx / 2,       // x-middle.
    ym = y + ry / 2;       // y-middle.

    this._ctx.beginPath();
    this._ctx.moveTo(x, ym);
    this._ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this._ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this._ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this._ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.line = function (x1, y1, x2, y2)
{
    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x1, y1);
    return this;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.polyline = function (arrCoords)
{
    this._ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i++)
    {
        var arrCoord = arrCoords[i];
        var x = arrCoord[0], y = arrCoord[1];
        if (i === 0)    this._ctx.moveTo(x, y);
        else            this._ctx.lineTo(x, y);
    }
    return this;
};

/** 
 * @inheritdoc
 */
CanvasRenderer.prototype.polygon = function (arrCoords)
{
    this.polyline(arrCoords);
    this._ctx.closePath();
    return this;
};

module.exports = CanvasRenderer;