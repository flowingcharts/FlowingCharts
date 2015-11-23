/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link HtmlCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/HtmlCanvas 
 * @requires canvas/Canvas
 * @requires util
 */

// Required modules.
var Canvas      = require('./Canvas');
var util        = require('../util');
var extendClass = util.extendClass;

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias HtmlCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {CartesianCoords|PolarCoords} coords The coordinate system to use when drawing. 
 */
function HtmlCanvas (coords)
{
    HtmlCanvas.baseConstructor.call(this, coords);
}
extendClass(Canvas, HtmlCanvas);

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.init = function()
{
    this.canvas = document.createElement('canvas'); // The drawing canvas.
    this._ctx   = this.canvas.getContext('2d');     // The drawing context.
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.isSupported = function ()
{
    return !!document.createElement('canvas').getContext;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.clear = function ()
{
    this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
HtmlCanvas.prototype.drawCircle = function (cx, cy, r)
{
    this._ctx.beginPath();
    this._ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawEllipse = function (x, y, w, h)
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
HtmlCanvas.prototype.drawRect = function (x, y, w, h)
{
    this._ctx.beginPath();
    this._ctx.rect(x, y, w, h);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawLine = function (x1, y1, x2, y2)
{
    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawPolyline = function (arrCoords)
{
    this._ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i+=2)
    {
        var x = arrCoords[i];
        var y = arrCoords[i+1];
        if (i === 0)    this._ctx.moveTo(x, y);
        else            this._ctx.lineTo(x, y);
    }
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawPolygon = function (arrCoords)
{
    this.drawPolyline(arrCoords);
    this._ctx.closePath();
    return this;
};

module.exports = HtmlCanvas;