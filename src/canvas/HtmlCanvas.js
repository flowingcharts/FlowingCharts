/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link HtmlCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/HtmlCanvas 
 * @requires canvas/Canvas
 * @requires utils/util
 * @requires utils/dom
 * @requires utils/color
 */

// Required modules.
var Canvas              = require('./Canvas');
var util                = require('../utils/util');
var extendClass         = util.extendClass;
var dom                 = require('../utils/dom');
var createElement       = dom.createElement;
var color               = require('../utils/color');
var toRGBA              = color.toRGBA;
var isRGBA              = color.isRGBA;

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
    this.graphics = createElement('canvas',     // The drawing canvas.
    {
        style :
        {
            position    : 'absolute',
            left        : 0,
            right       : 0 
        }
    });
    this.ctx = this.graphics.getContext('2d');  // The drawing context.
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
    this.ctx.clearRect(0, 0, this.graphics.width, this.graphics.height);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawFill = function ()
{
    var rgbaColor = this.fillColor();
    if (isRGBA(rgbaColor) === false) rgbaColor = toRGBA(this.fillColor(), this.fillOpacity());

    this.ctx.fillStyle      = rgbaColor;     
    this.ctx.fill();
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawStroke = function (options)
{
    var rgbaColor = this.lineColor();
    if (isRGBA(rgbaColor) === false) rgbaColor = toRGBA(this.lineColor(), this.lineOpacity());

    this.ctx.strokeStyle    = rgbaColor;
    this.ctx.lineWidth      = this.lineWidth();
    this.ctx.lineJoin       = this.lineJoin();
    this.ctx.lineCap        = this.lineCap();
    this.ctx.stroke();
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawCircle = function (cx, cy, r)
{
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
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

    this.ctx.beginPath();
    this.ctx.moveTo(x, ym);
    this.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawRect = function (x, y, w, h)
{
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawLine = function (x1, y1, x2, y2)
{
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawPolyline = function (arrCoords)
{
    this.ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i+=2)
    {
        var x = arrCoords[i];
        var y = arrCoords[i+1];
        if (i === 0)    this.ctx.moveTo(x, y);
        else            this.ctx.lineTo(x, y);
    }
    return this;
};

/** 
 * @inheritdoc
 */
HtmlCanvas.prototype.drawPolygon = function (arrCoords)
{
    this.drawPolyline(arrCoords);
    this.ctx.closePath();
    return this;
};

module.exports = HtmlCanvas;