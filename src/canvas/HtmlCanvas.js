/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link HtmlCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/HtmlCanvas 
 * @requires renderers/Canvas
 * @requires util
 */

// Required modules.
var Canvas    = require('./Canvas');
var util        = require('../util');
var extendClass = util.extendClass;
var isNumber    = util.isNumber;

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias HtmlCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 * @param {Canvas~onResize} [options.onResize] Function called when the canvas resizes. 
 */
function HtmlCanvas (options)
{
    // Private instance members.
    this._canvas  = document.createElement('canvas');   // The drawing canvas.
    this._ctx     = this._canvas.getContext('2d');      // The drawing context.
    
    HtmlCanvas.baseConstructor.call(this, options);
}
extendClass(Canvas, HtmlCanvas);

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.canvasElement = function ()
{
    return this._canvas;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.clear = function ()
{
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawFill = function ()
{
    // TODO opacity
    this._ctx.fillStyle      = this.fillColor();
    this._ctx.fill();
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawStroke = function (options)
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
HtmlCanvas.prototype.circle = function (cx, cy, r)
{
    this._ctx.beginPath();
    this._ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.ellipse = function (x, y, w, h)
{
    var kappa = 0.5522848,
    ox = (w / 2) * kappa, // control point offset horizontal.
    oy = (h / 2) * kappa, // control point offset vertical.
    xe = x + w,           // x-end.
    ye = y + h,           // y-end.
    xm = x + w / 2,       // x-middle.
    ym = y + h / 2;       // y-middle.

    this._ctx.beginPath();
    this._ctx.moveTo(x, ym);
    this._ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this._ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this._ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this._ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.rect = function (x, y, w, h)
{
    this._ctx.beginPath();
    this._ctx.rect(x, y, w, h);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.line = function (x1, y1, x2, y2)
{
    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x1, y1);
    return this;
};


/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.polyline = function (arrCoords)
{
    this._ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i+=2)
    {
        var x = arrCoords[i], y = arrCoords[i+1];
        if (i === 0)    this._ctx.moveTo(x, y);
        else            this._ctx.lineTo(x, y);
    }
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.polygon = function (arrCoords)
{
    this.polyline(arrCoords);
    this._ctx.closePath();
    return this;
};

module.exports = HtmlCanvas;