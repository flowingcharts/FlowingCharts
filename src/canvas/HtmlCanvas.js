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
var Canvas          = require('./Canvas');
var util            = require('../utils/util');
var extendClass     = util.extendClass;
var dom             = require('../utils/dom');
var createElement   = dom.createElement;
var color           = require('../utils/color');
var toRGBA          = color.toRGBA;
var isRGBA          = color.isRGBA;

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
 * Initialisation code.
 *
 * @since 0.1.0
 * @private
 */
HtmlCanvas.prototype.init = function()
{
    // Public instance members.  
    this.graphicsElement = createElement('canvas',     // The drawing canvas.
    {
        style : {position:'absolute', left:0, right:0}
    });
    this.ctx = this.graphicsElement.getContext('2d');  // The drawing context.
};

/** 
 * Check for support of the graphics library.
 *
 * @since 0.1.0
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
HtmlCanvas.prototype.isSupported = function ()
{
    return !!document.createElement('canvas').getContext;
};

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 */
HtmlCanvas.prototype.clear = function ()
{
    this.items = [];
    this.ctx.clearRect(0, 0, this.graphicsElement.width, this.graphicsElement.height);
};

/** 
 * Provides the fill drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
HtmlCanvas.prototype.drawFill = function (item)
{
    var rgbaColor = item.fillColor();
    if (isRGBA(rgbaColor) === false) rgbaColor = toRGBA(item.fillColor(), item.fillOpacity());

    this.ctx.fillStyle = rgbaColor;     
    this.ctx.fill();
};

/** 
 * Provides the stroke drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
HtmlCanvas.prototype.drawStroke = function (item)
{
    if (item.lineWidth() > 0)
    {
        var rgbaColor = item.lineColor();
        if (isRGBA(rgbaColor) === false) rgbaColor = toRGBA(item.lineColor(), item.lineOpacity());

        this.ctx.strokeStyle = rgbaColor;
        this.ctx.lineWidth   = item.lineWidth();
        this.ctx.lineJoin    = item.lineJoin();
        this.ctx.lineCap     = item.lineCap();
        this.ctx.stroke();
    }
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @param {number} cx The x position of the center of the circle.
 * @param {number} cy The y position of the center of the circle.
 * @param {number} r The circle radius.
 * @private
 */
HtmlCanvas.prototype.drawCircle = function (item, cx, cy, r)
{
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @param {number} cx The x position of the center of the ellipse.
 * @param {number} cy The y position of the center of the ellipse
 * @param {number} rx The x radius of the ellipse.
 * @param {number} ry The y radius of the ellipse.
 * @private
 */
HtmlCanvas.prototype.drawEllipse = function (item, cx, cy, rx, ry)
{
    var kappa = 0.5522848,
    x  = cx - rx,       // x-start.
    y  = cy - ry,       // y-start.
    xe = cx + rx,       // x-end.
    ye = cy + ry,       // y-end.
    ox = rx * kappa,    // Control point offset horizontal.
    oy = ry * kappa;    // Control point offset vertical.

    this.ctx.beginPath();
    this.ctx.moveTo(x, cy);
    this.ctx.bezierCurveTo(x, cy - oy, cx - ox, y, cx, y);
    this.ctx.bezierCurveTo(cx + ox, y, xe, cy - oy, xe, cy);
    this.ctx.bezierCurveTo(xe, cy + oy, cx + ox, ye, cx, ye);
    this.ctx.bezierCurveTo(cx - ox, ye, x, cy + oy, x, cy);
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y position of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @private
 */
HtmlCanvas.prototype.drawRect = function (item, x, y, w, h)
{
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 * @param {PathItem} item A path item.
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @private
 */
HtmlCanvas.prototype.drawLine = function (item, x1, y1, x2, y2)
{
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 * @param {PathItem} item A path item.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
HtmlCanvas.prototype.drawPolyline = function (item, arrCoords)
{
    this.ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i+=2)
    {
        var x = arrCoords[i];
        var y = arrCoords[i+1];
        if (i === 0) this.ctx.moveTo(x, y);
        else         this.ctx.lineTo(x, y);
    }
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 * @param {PathItem} item A path item.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
HtmlCanvas.prototype.drawPolygon = function (item, arrCoords)
{
    this.drawPolyline(arrCoords);
    this.ctx.closePath();
};

module.exports = HtmlCanvas;