/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains canvas drawing routines.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          canvas 
 * @requires        utils/dom
 * @requires        utils/color
 */

// Required modules.
var dom       = require('../utils/dom');
var colorUtil = require('../utils/color');

/** 
 * Checks for canvas support.
 *
 * @since 0.1.0
 *
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
var isSupported = function ()
{
    return !!dom.createElement('canvas').getContext('2d');
};

/** 
 * Returns an absolutely positioned canvas that can be stacked in a relative container.
 *
 * @since 0.1.0
 *
 * @return {HtmlCanvas} A canvas.
 */
var getCanvas = function ()
{
    var canvas = dom.createElement('canvas'); 
    dom.style(canvas, {position:'absolute', left:0, right:0});
    return canvas;
};

/** 
 * Returns a drawing context.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvas}  canvas The canvas.
 * @param {string}      type   The element type.
 *
 * @return {HtmlCanvasContext} A canvas context.
 */
var getContext = function (canvas, type)
{
    return canvas.getContext('2d');
};

/** 
 * Clears the canvas.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvas} canvas The canvas.
 */
var clear = function (canvas)
{
    empty(canvas);
};

/** 
 * Empties the canvas.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvas} canvas The canvas.
 */
var empty = function (canvas)
{
    getContext(canvas).clearRect(0, 0, canvas.width, canvas.height);
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              cx                  The x position of the center of the circle.
 * @param {number}              cy                  The y position of the center of the circle.
 * @param {number}              r                   The circle radius.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var circle = function (ctx, cx, cy, r, style)
{
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    draw(ctx, style);
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              cx                  The x position of the center of the ellipse.
 * @param {number}              cy                  The y position of the center of the ellipse
 * @param {number}              rx                  The x radius of the ellipse.
 * @param {number}              ry                  The y radius of the ellipse.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var ellipse = function (ctx, cx, cy, rx, ry, style)
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
    draw(ctx, style);
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              x                   The x position of the top left corner.
 * @param {number}              y                   The y position of the top left corner.
 * @param {number}              w                   The width.
 * @param {number}              h                   The height.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var rect = function (ctx, x, y, w, h, style)
{
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    draw(ctx, style);
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number}              x1                  The x position of point 1.
 * @param {number}              y1                  The y position of point 1.
 * @param {number}              x2                  The x position of point 2.
 * @param {number}              y2                  The y position of point 2.
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var line = function (ctx, x1, y1, x2, y2, style)
{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    draw(ctx, style);
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number[]}            arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polyline = function (ctx, arrCoords, style)
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
    draw(ctx, style);
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 *
 * @param {HtmlCanvasContext}   ctx                 The canvas context to draw to.
 * @param {number[]}            arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}              [style]             The style properties.
 * @param {string}              [style.fillColor]   The fill color.
 * @param {number}              [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}              [style.lineColor]   The line color.
 * @param {number}              [style.lineWidth]   The line width.
 * @param {string}              [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polygon = function (ctx, arrCoords, style)
{
    polyline(arrCoords);
    ctx.closePath();
    draw(ctx, style);
};

/** 
 * Provides the fill drawing routine.
 *
 * @since 0.1.0
 * @private
 *
 * @param {HtmlCanvasContext}   ctx                         The canvas context to draw to.
 * @param {Object}              [style]                     The style properties.
 * @param {string}              [style.fillColor]           The fill color.
 * @param {number}              [style.fillOpacity = 1]     The fill opacity.
 * @param {string}              [style.lineColor]           The line color.
 * @param {number}              [style.lineWidth = 1]       The line width.
 * @param {string}              [style.lineJoin = round]    The line join, one of "bevel", "round", "miter".
 * @param {string}              [style.lineCap = butt]      The line cap, one of "butt", "round", "square".
 * @param {number}              [style.lineOpacity = 1]     The line opacity. Overrides any alpha value on the fill color.
 */
function draw (ctx, style)
{
    // Fill.
    if (style.fillColor !== undefined)
    {
        ctx.fillStyle   = style.fillOpacity !== undefined ? colorUtil.toRGBA(style.fillColor, style.fillOpacity) : colorUtil.toRGBA(style.fillColor);
        ctx.fill();
    }

    // Stroke.
    if (style.lineColor !== undefined && style.lineWidth !== 0)
    {
        ctx.lineWidth   = style.lineWidth   !== undefined ? style.lineWidth : 1;
        ctx.lineJoin    = style.lineJoin    !== undefined ? style.lineJoin  : 'round';
        ctx.lineCap     = style.lineCap     !== undefined ? style.lineCap   : 'butt';
        ctx.strokeStyle = style.lineOpacity !== undefined ? colorUtil.toRGBA(style.lineColor, style.lineOpacity) : colorUtil.toRGBA(style.lineColor);
        ctx.stroke();
    }
}

module.exports = 
{
    isSupported : isSupported,
    getCanvas   : getCanvas,
    getContext  : getContext,
    clear       : clear,
    empty       : empty,
    draw        : draw,
    circle      : circle,
    ellipse     : ellipse,
    rect        : rect,
    line        : line,
    polyline    : polyline,
    polygon     : polygon
};