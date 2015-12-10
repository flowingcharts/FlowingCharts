/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains canvas drawing routines.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas 
 * @requires utils/dom
 * @requires utils/color
 */

// Required modules.
var dom       = require('../utils/dom');
var colorUtil = require('../utils/color');

/** 
 * Check for canvas support.
 *
 * @since 0.1.0
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
var isSupported = function ()
{
    return !!document.dom.createElement('canvas').getContext;
};

/** 
 * Clears the canvas.
 *
 * @param {HtmlCanvas} canvas The canvas.
 * @param {HtmlCanvasContext} ctx The canvas context.
 * @since 0.1.0
 */
var clear = function (canvas, ctx)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/** 
 * Provides the fill drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @param {HtmlCanvasContext} ctx The canvas context to draw to.
 * @param {CanvasItem} item A canvas item.
 * @param {Object} [options] The style properties.
 * @param {string} [options.fillColor] The fill color.
 * @param {number} [options.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string} [options.lineColor] The line color.
 * @param {number} [options.lineWidth] The line width.
 * @param {string} [options.lineJoin] The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap] The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 * @private
 */
var draw = function (ctx, options)
{
    // Fill.
    if (options.fillColor !== undefined)
    {
        if (options.fillOpacity !== undefined)
        {
            var rgbaFillStyle = options.fillColor;
            if (colorUtil.isRGBA(rgbaFillStyle) === false) rgbaFillStyle = colorUtil.toRGBA(options.fillColor, options.fillOpacity);
            ctx.fillStyle = rgbaFillStyle;       
        }
        else ctx.fillStyle = options.fillColor; 
        ctx.fill();
    }

    // Stroke.
    if (options.lineWidth !== undefined && options.lineWidth > 0)
    {
        if (options.lineOpacity !== undefined)
        {
            var rgbaLineStyle = options.lineColor;
            if (colorUtil.isRGBA(rgbaLineStyle) === false) rgbaLineStyle = colorUtil.toRGBA(options.lineColor, options.lineOpacity);
            ctx.strokeStyle = rgbaLineStyle;
        }
        else ctx.strokeStyle = options.lineColor;

        if (ctx.lineWidth !== undefined) ctx.lineWidth = options.lineWidth;
        if (ctx.lineJoin !== undefined)  ctx.lineJoin  = options.lineJoin;
        if (ctx.lineCap !== undefined)   ctx.lineCap   = options.lineCap;
        ctx.stroke();
    }
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 * @param {HtmlCanvasContext} ctx The canvas context to draw to.
 * @param {number} cx The x position of the center of the circle.
 * @param {number} cy The y position of the center of the circle.
 * @param {number} r The circle radius.
 * @private
 */
var circle = function (ctx, cx, cy, r)
{
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 * @param {HtmlCanvasContext} ctx The canvas context to draw to.
 * @param {number} cx The x position of the center of the ellipse.
 * @param {number} cy The y position of the center of the ellipse
 * @param {number} rx The x radius of the ellipse.
 * @param {number} ry The y radius of the ellipse.
 * @private
 */
var ellipse = function (ctx, cx, cy, rx, ry)
{
    var kappa = 0.5522848,
    x  = cx - rx,       // x-start.
    y  = cy - ry,       // y-start.
    xe = cx + rx,       // x-end.
    ye = cy + ry,       // y-end.
    ox = rx * kappa,    // Control point offset horizontal.
    oy = ry * kappa;    // Control point offset vertical.

    ctx.beginPath();
    ctx.moveTo(x, cy);
    ctx.bezierCurveTo(x, cy - oy, cx - ox, y, cx, y);
    ctx.bezierCurveTo(cx + ox, y, xe, cy - oy, xe, cy);
    ctx.bezierCurveTo(xe, cy + oy, cx + ox, ye, cx, ye);
    ctx.bezierCurveTo(cx - ox, ye, x, cy + oy, x, cy);
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 * @param {HtmlCanvasContext} ctx The canvas context to draw to.
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y position of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @private
 */
var rect = function (ctx, x, y, w, h)
{
    ctx.beginPath();
    ctx.rect(x, y, w, h);
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 * @param {HtmlCanvasContext} ctx The canvas context to draw to.
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @private
 */
var line = function (ctx, x1, y1, x2, y2)
{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 * @param {HtmlCanvasContext} ctx The canvas context to draw to.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
var polyline = function (ctx, arrCoords)
{
    ctx.beginPath();
    var n = arrCoords.length;
    for (var i = 0; i < n; i+=2)
    {
        var x = arrCoords[i];
        var y = arrCoords[i+1];
        if (i === 0) ctx.moveTo(x, y);
        else         ctx.lineTo(x, y);
    }
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 * @param {HtmlCanvasContext} ctx The canvas context to draw to.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
var polygon = function (ctx, arrCoords)
{
    polyline(arrCoords);
    ctx.closePath();
};

module.exports = 
{
    isSupported : isSupported,
    clear       : clear,
    draw        : draw,
    circle      : circle,
    ellipse     : ellipse,
    rect        : rect,
    line        : line,
    polyline    : polyline,
    polygon     : polygon
};