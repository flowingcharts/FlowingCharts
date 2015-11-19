/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/SvgCanvas 
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
 * @alias SvgCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function SvgCanvas (options)
{
    SvgCanvas.baseConstructor.call(this, options);
}
extendClass(Canvas, SvgCanvas);

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.init = function()
{
    // Private instance members.
    this._svgNS         = 'http://www.w3.org/2000/svg'; // Namespace for SVG elements.
    this._svgElement    = null;                         // The svg element that is part of the current drawing routine.

    // Public instance members.
    this.canvas         = this.createElement('svg');    // The main svg element.
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.clear = function ()
{
    while (this.canvas.firstChild) 
    {
        this.canvas.removeChild(this.canvas.firstChild);
    }
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawFill = function ()
{
    this.attr(this._svgElement, 
    {
        'fill'            : this.fillColor(),
        'fill-opacity'    : this.fillOpacity()
    });
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawStroke = function ()
{
    this.attr(this._svgElement, 
    {
        'stroke'            : this.lineColor(),
        'stroke-width'      : this.lineWidth(),
        'stroke-linejoin'   : this.lineJoin(),
        'stroke-linecap'    : this.lineCap(),
        'stroke-opacity'    : this.lineOpacity()
    });
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.circle = function (cx, cy, r)
{
    var svgCircle = this.createElement('circle',       
    {
        'cx'    : this.getPixelX(cx),
        'cy'    : this.getPixelY(cy),
        'r'     : r
    });

    this.canvas.appendChild(svgCircle);
    this._svgElement = svgCircle;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.ellipse = function (x, y, w, h)
{
    w = this.getPixelWidth(w);
    h = this.getPixelHeight(h);
    x = this.getPixelX(x);
    y = this.getPixelY(y) - h;

    var rx = w / 2;
    var ry = h / 2;
    var cx = x + rx;
    var cy = y + ry;

    var svgEllipse = this.createElement('ellipse',       
    {
        'cx'    : cx,
        'cy'    : cy,
        'rx'    : rx,
        'ry'    : ry
    });

    this.canvas.appendChild(svgEllipse);
    this._svgElement = svgEllipse;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.rect = function (x, y, w, h)
{
    w = this.getPixelWidth(w);
    h = this.getPixelHeight(h);
    x = this.getPixelX(x);
    y = this.getPixelY(y) - h;

    var svgRect = this.createElement('rect',       
    {
        'x'         : x,
        'y'         : y,
        'width'     : w,
        'height'    : h
    });

    this.canvas.appendChild(svgRect);
    this._svgElement = svgRect;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.line = function (x1, y1, x2, y2)
{
    var svgLine = this.createElement('line',       
    {
        'x1' : this.getPixelX(x1),
        'y1' : this.getPixelY(y1),
        'x2' : this.getPixelX(x2),
        'y2' : this.getPixelY(y2)
    });

    this.canvas.appendChild(svgLine);
    this._svgElement = svgLine;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polyline = function (arrCoords)
{
    var svgPolyline = this.createElement('polyline',       
    {
        'points' : this.getPointsAsString(arrCoords)
    });

    this.canvas.appendChild(svgPolyline);
    this._svgElement = svgPolyline;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polygon = function (arrCoords)
{
    var svgPolygon = this.createElement('polygon',       
    {
        'points' : this.getPointsAsString(arrCoords)
    });

    this.canvas.appendChild(svgPolygon);
    this._svgElement = svgPolygon;

    return this;
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @param {number[]} arrCoords The list of coords.
 * @return {string} A string containing the list of coords.
 */
SvgCanvas.prototype.getPointsAsString = function (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n; i+=2)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + this.getPixelX(arrCoords[i]) + ' ' + this.getPixelY(arrCoords[i+1]);
    }
    return strPoints;
};

/** 
 * Creates an element with the given attributes.
 * 
 * @since 0.1.0
 * @param {string} type The element type.
 * @return {attr} attr The list of attributes.
 */
SvgCanvas.prototype.createElement = function (type, attr)
{
    var svgElement = document.createElementNS(this._svgNS, type);
    this.attr(svgElement, attr);
    return svgElement;
};

/** 
 * Sets the attributes for the given svg element.
 * 
 * @since 0.1.0
 * @param {SVGElement} svgElement The svg element.
 * @return {attr} attr The list of attributes.
 */
SvgCanvas.prototype.attr = function (svgElement, attr)
{
    for (var property in attr) 
    {
        if (attr.hasOwnProperty(property))  
        {
            svgElement.setAttribute(property, attr[property]);
        }
    }
};

module.exports = SvgCanvas;